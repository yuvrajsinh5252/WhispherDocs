import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import {
  EMBEDDING_MODEL,
  PINECONE_INDEX_NAME,
  SEARCH_RESULTS_LIMIT,
} from "./constants";
import { UIMessage } from "ai";

export async function searchDocumentContext(
  message: string,
  fileId: string,
  fileName?: string
): Promise<UIMessage> {
  try {
    const embeddings = new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY,
      model: EMBEDDING_MODEL,
    });

    const pinecone = PineconeClient();
    const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: fileId,
    });

    const results = await vectorStore.similaritySearch(
      message,
      SEARCH_RESULTS_LIMIT
    );

    console.log(results);

    const documentContext = results
      .map((result, index) => {
        const content = result.pageContent || "";
        const source = result.metadata?.source || fileName || fileId;
        const pageNum = result.metadata?.pageNumber
          ? ` (Page ${result.metadata.pageNumber})`
          : "";

        return `--- Document Chunk ${
          index + 1
        } from ${source}${pageNum} ---\n${content}`;
      })
      .join("\n\n");

    return {
      id: "document-context",
      role: "system",
      parts: [
        {
          type: "text",
          text: `Here is the relevant document context to help answer the user's question:\n\n${documentContext}\n\nPlease use this context to answer the user's question accurately and cite specific parts when relevant.`,
        },
      ],
    };
  } catch (error) {
    console.error("Document search error:", error);
    return {
      id: "document-context",
      role: "system",
      parts: [
        {
          type: "text",
          text: "No document context available due to search error.",
        },
      ],
    };
  }
}
