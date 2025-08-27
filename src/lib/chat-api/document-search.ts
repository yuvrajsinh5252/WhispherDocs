import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import {
  EMBEDDING_MODEL,
  PINECONE_INDEX_NAME,
  SEARCH_RESULTS_LIMIT,
} from "./constants";
import { UIMessage } from "ai";

export interface DocumentChunk {
  id: string;
  data: {
    text: string;
  };
  metadata?: {
    source: string;
    [key: string]: any;
  };
}

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

    const formattedResults = (results || []).map((result, index) => ({
      id: `doc-${index + 1}`,
      data: { text: result.pageContent || "" },
      ...(result.metadata && {
        metadata: {
          ...result.metadata,
          source: fileName || fileId,
        },
      }),
    }));

    return buildSourceDocsMessage(formattedResults);
  } catch (error) {
    console.error("Document search error:", error);
    return {
      id: "retrieved-docs",
      role: "assistant",
      parts: [],
    };
  }
}

export function buildSourceDocsMessage(docs: DocumentChunk[]): UIMessage {
  return {
    id: "retrieved-docs",
    role: "assistant",
    parts: docs.map((doc) => ({
      type: "data-source-document",
      data: {
        sourceId: doc.id,
        mediaType: "text/plain",
        title: doc.metadata?.source,
        text: doc.data.text,
      },
    })),
  };
}
