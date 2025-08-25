export const DEFAULT_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_TEMPERATURE = 0.2;
export const SEARCH_RESULTS_LIMIT = 4;
export const MESSAGE_HISTORY_LIMIT = 4;
export const EMBEDDING_MODEL = "embed-multilingual-v3.0";
export const PINECONE_INDEX_NAME = "cohere-pinecone-trec";

export const GROQ_MODELS = {
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    description: "Most capable Llama model with enhanced reasoning",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: "groq",
  },
  "llama-3.1-70b-versatile": {
    name: "Llama 3.1 70B",
    description: "Advanced reasoning with large context",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: "groq",
  },
  "llama-3.1-8b-instant": {
    name: "Llama 3.1 8B",
    description: "Fast and efficient for quick responses",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: false,
    provider: "groq",
  },
  "mixtral-8x7b-32768": {
    name: "Mixtral 8x7B",
    description: "Expert mixture model with strong performance",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: "groq",
  },
  "gemma2-9b-it": {
    name: "Gemma 2 9B",
    description: "Google's lightweight model",
    maxTokens: 8192,
    supportsCitations: false,
    supportsReasoning: false,
    provider: "groq",
  },
  // Keep Cohere models for comparison/fallback
  "command-a-reasoning-08-2025": {
    name: "Command A Reasoning",
    description: "Advanced reasoning with agentic capabilities",
    maxTokens: 256000,
    supportsCitations: true,
    supportsReasoning: true,
    provider: "cohere",
  },
  aya: {
    name: "Aya",
    description: "Multilingual model with cultural awareness",
    maxTokens: 128000,
    supportsCitations: true,
    supportsReasoning: false,
    provider: "cohere",
  },
} as const;

export type ModelId = keyof typeof GROQ_MODELS;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "Not Found",
  PROCESSING_ERROR:
    "Sorry, I encountered an error processing your request. Please try again with a shorter query.",
  GENERAL_ERROR: "Failed to process request",
} as const;
