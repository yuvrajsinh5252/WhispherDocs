import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { CohereClientV2 } from "cohere-ai";
import {
  EMBEDDING_MODEL,
  PINECONE_INDEX_NAME,
  SEARCH_RESULTS_LIMIT,
  DEFAULT_MODEL,
} from "./constants";

export async function searchDocumentContext(
  message: string,
  fileId: string
): Promise<any[]> {
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
    return results || [];
  } catch (error) {
    console.error("Document search error:", error);
    return [];
  }
}

export async function classifyQuery(
  message: string,
  searchResults: any[],
  cohere: CohereClientV2
): Promise<boolean> {
  try {
    const queryClassification = await cohere.chat({
      model: DEFAULT_MODEL,
      temperature: 0.0,
      messages: [
        {
          role: "system",
          content: `You are a query classifier. Analyze the user's query and determine if it:
          1. Requires document-specific knowledge (DOCUMENT_SPECIFIC)
          2. Is a simple general question that doesn't need document context (GENERAL_QUERY)

          ALWAYS classify these types of queries as DOCUMENT_SPECIFIC:
          - Questions about document content
          - Requests for summarization
          - Requests for key point extraction
          - Analysis requests
          - Explanation requests
          - Any query that references "this document", "the document", "the text", "the content", etc.

          When in doubt, classify as DOCUMENT_SPECIFIC to ensure users get document context.

          Return ONLY "DOCUMENT_SPECIFIC" or "GENERAL_QUERY" as your answer with no additional text.`,
        },
        {
          role: "user",
          content: `Classify this query: "${message}"

        Document search results:
        ${searchResults
          .map(
            (r, i) =>
              `[Result ${i + 1}]: ${r.pageContent?.substring(0, 200) || ""}...`
          )
          .join("\n\n")}`,
        },
      ],
    });

    const responseType =
      queryClassification.message?.content?.[0]?.text || "DOCUMENT_SPECIFIC";
    return responseType === "DOCUMENT_SPECIFIC";
  } catch (error) {
    console.error("Query classification error:", error);
    return true;
  }
}

export function prepareDocumentChunks(
  searchResults: any[],
  fileName: string
): any[] {
  return searchResults.map((result, index) => ({
    id: `doc-${index + 1}`,
    data: { text: result.pageContent || "" },
    ...(result.metadata && {
      metadata: {
        ...result.metadata,
        source: fileName,
      },
    }),
  }));
}
