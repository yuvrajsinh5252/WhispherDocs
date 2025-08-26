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
