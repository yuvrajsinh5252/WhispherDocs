export const DEFAULT_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_TEMPERATURE = 0.2;
export const SEARCH_RESULTS_LIMIT = 4;
export const MESSAGE_HISTORY_LIMIT = 4;
export const EMBEDDING_MODEL = "embed-multilingual-v3.0";
export const PINECONE_INDEX_NAME = "cohere-pinecone-trec";

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "Not Found",
  PROCESSING_ERROR:
    "Sorry, I encountered an error processing your request. Please try again with a shorter query.",
  GENERAL_ERROR: "Failed to process request",
} as const;
