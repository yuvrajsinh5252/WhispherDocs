import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeClient } from "@/lib/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const f = createUploadthing();

export const ourFileRouter = {
  PDFUploader: f({
    pdf: {
      maxFileSize: `${process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB}MB` as any,
    },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://utfs.io/f/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      const pdf_parser = process.env.PDF_PARSER;

      try {
        // fetching the pdf and loading it to memory
        const response = await fetch(`https://utfs.io/f/${file.key}`);
        const blob = await response.blob();

        let parsed_pdf = null;

        if (pdf_parser === "docling") {
        } else {
          // loading the pdf to memory
          const loader = new PDFLoader(blob);
          parsed_pdf = await loader.load();
        }

        console.log("Parsed PDF:", parsed_pdf);

        if (!parsed_pdf) throw new Error("Failed to parse PDF");

        // Clean excessive whitespace/newlines and split into semantic chunks
        const cleanedDocs = parsed_pdf.map((doc: any) => {
          const cleanedPageContent = (doc.pageContent || "")
            .replace(/\s{2,}/g, " ")
            .trim();
          return {
            ...doc,
            pageContent: cleanedPageContent,
          };
        });

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const splitDocs = await splitter.splitDocuments(cleanedDocs);

        // Normalize metadata for page number and source on each chunk
        const normalizedDocs = splitDocs.map((doc: any) => {
          const meta = doc.metadata || {};
          const nestedLoc =
            meta.loc && typeof meta.loc === "object" ? meta.loc : undefined;
          const stringKeyPage = meta["loc.pageNumber"];
          const pageNumber =
            meta.pageNumber ||
            (nestedLoc && nestedLoc.pageNumber) ||
            stringKeyPage ||
            undefined;

          const source =
            meta.source || (file && file.name) || (file && file.url) || "blob";

          return {
            ...doc,
            metadata: {
              ...meta,
              pageNumber,
              source,
            },
          };
        });

        // vectorizing and indexing the entire pdf to pinecone
        const pinecone = PineconeClient();
        const pineconeIndex = pinecone.Index("cohere-pinecone-trec");

        const embeddings = new CohereEmbeddings({
          apiKey: process.env.COHERE_API_KEY,
          model: "embed-multilingual-v3.0",
        });

        const pineconeStore = await PineconeStore.fromDocuments(
          normalizedDocs,
          embeddings,
          {
            pineconeIndex,
            namespace: createdFile.id,
          }
        );

        await db.file.update({
          data: { uploadStatus: "SUCCESS" },
          where: { id: createdFile.id },
        });
      } catch (err) {
        await db.file.update({
          data: { uploadStatus: "FAILED" },
          where: { id: createdFile.id },
        });

        console.error(err);
      }

      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
