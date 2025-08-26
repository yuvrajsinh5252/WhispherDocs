export const GROQ_MODELS = {
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill 70B",
    description: "Advanced reasoning model with step-by-step thinking",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: "groq",
  },
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
} as const;

export type GroqModelId = keyof typeof GROQ_MODELS;

export const COHERE_MODELS = {
  "command-a-reasoning-08-2025": {
    name: "Command A Reasoning",
    description: "Advanced reasoning with agentic capabilities",
    maxTokens: 256000,
    supportsCitations: true,
    supportsReasoning: true,
    provider: "cohere",
  },
  "c4ai-aya-expanse-32b": {
    name: "Aya Expanse",
    description:
      "Aya Expanse is a 32B multilingual model with monolingual-level performance in 23 languages.",
    maxTokens: 128000,
    supportsCitations: true,
    supportsReasoning: false,
    provider: "cohere",
  },
} as const;

export type CohereModelId = keyof typeof COHERE_MODELS;

export const ALL_MODELS = {
  ...GROQ_MODELS,
  ...COHERE_MODELS,
} as const;

export type ModelId = keyof typeof ALL_MODELS;
