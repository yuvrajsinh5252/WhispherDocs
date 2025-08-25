export const COHERE_MODELS = {
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

export type CohereModelId = keyof typeof COHERE_MODELS;
