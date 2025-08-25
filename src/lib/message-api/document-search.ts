import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { CohereClientV2 } from "cohere-ai";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import {
  EMBEDDING_MODEL,
  PINECONE_INDEX_NAME,
  SEARCH_RESULTS_LIMIT,
  ALL_MODELS,
  type ModelId,
} from "./constants";

const CLASSIFICATION_SYSTEM_PROMPT = `You are a query classifier. Analyze the user's query and determine if it:
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

Return ONLY "DOCUMENT_SPECIFIC" or "GENERAL_QUERY" as your answer with no additional text.`;

const createClassificationUserMessage = (
  message: string,
  searchResults: any[]
) =>
  `Classify this query: "${message}"

Document search results:
${searchResults
  .map(
    (r, i) => `[Result ${i + 1}]: ${r.pageContent?.substring(0, 200) || ""}...`
  )
  .join("\n\n")}`;

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
  selectedModel: ModelId
): Promise<boolean> {
  try {
    const modelConfig = ALL_MODELS[selectedModel];
    const userMessage = createClassificationUserMessage(message, searchResults);

    const messages = [
      { role: "system" as const, content: CLASSIFICATION_SYSTEM_PROMPT },
      { role: "user" as const, content: userMessage },
    ];

    let responseText: string;

    if (modelConfig.provider === "groq") {
      const groq = createGroq({
        apiKey: process.env.GROQ_API_KEY,
      });

      const { text } = await generateText({
        model: groq(selectedModel),
        messages,
        temperature: 0.0,
      });

      responseText = text.trim();
    } else {
      const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

      const queryClassification = await cohere.chat({
        model: selectedModel,
        temperature: 0.0,
        messages,
      });

      responseText =
        queryClassification.message?.content?.[0]?.text?.trim() ||
        "DOCUMENT_SPECIFIC";
    }

    return responseText === "DOCUMENT_SPECIFIC";
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
