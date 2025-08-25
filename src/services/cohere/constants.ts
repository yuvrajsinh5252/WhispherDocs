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
