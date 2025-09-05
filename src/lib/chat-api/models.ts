import { groq } from "@ai-sdk/groq";
import { cohere } from "@ai-sdk/cohere";
import { google } from "@ai-sdk/google";
import { Brain, Cpu } from "lucide-react";
import { Languages } from "lucide-react";

export type ModelId = keyof typeof MODELS;

export const MODELS = {
  "gemini-2.5-pro": {
    name: "Gemini 2.5 Pro",
    description:
      "Enhanced reasoning and multimodal comprehension with Deep Think mode - Supports audio, images, video, text, PDF",
    maxTokens: 0,
    supportsCitations: true,
    supportsReasoning: true,
    provider: google("gemini-2.5-pro"),
    providerOptions: {
      google: {
        thinkingMode: true,
      },
    },
    icon: Cpu,
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    description:
      "Excellent price-to-performance balance with internal thinking - Supports audio, images, video, text",
    maxTokens: 0,
    supportsCitations: true,
    supportsReasoning: true,
    provider: google("gemini-2.5-flash"),
    providerOptions: {
      google: {
        thinkingMode: true,
      },
    },
    icon: Cpu,
  },
  "gemini-2.5-flash-lite": {
    name: "Gemini 2.5 Flash Lite",
    description:
      "Ultra cost-efficient, high-throughput model with 1M token context - Supports text, images, video, audio",
    maxTokens: 1000000,
    supportsCitations: true,
    supportsReasoning: false,
    provider: google("gemini-2.5-flash-lite"),
    providerOptions: {
      google: {},
    },
    icon: Cpu,
  },
  "command-a-03-2025": {
    name: "Command A",
    description:
      "Most performant model excelling at tool use, agents, RAG, and multilingual tasks - 256K context, 23 languages",
    maxTokens: 8192,
    supportsCitations: true,
    supportsReasoning: false,
    provider: cohere("command-a-03-2025"),
    providerOptions: {
      cohere: {},
    },
    icon: Brain,
  },
  "command-r-plus-08-2024": {
    name: "Command R+ 08-2024",
    description:
      "High-quality conversational model for complex RAG workflows and multi-step tool use - 23 languages",
    maxTokens: 4096,
    supportsCitations: true,
    supportsReasoning: false,
    provider: cohere("command-r-plus-08-2024"),
    providerOptions: {
      cohere: {},
    },
    icon: Brain,
  },
  "c4ai-aya-expanse-32b": {
    name: "Aya Expanse 32B",
    description:
      "Highly performant 32B multilingual model with monolingual-level performance in 23 languages",
    maxTokens: 4096,
    supportsCitations: true,
    supportsReasoning: false,
    provider: cohere("c4ai-aya-expanse-32b"),
    providerOptions: {
      cohere: {},
    },
    icon: Languages,
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B Versatile",
    description: "Highly capable for large context tasks - Production ready",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: false,
    provider: groq("llama-3.3-70b-versatile"),
    providerOptions: {
      groq: {},
    },
    icon: Cpu,
  },
  "openai/gpt-oss-120b": {
    name: "GPT OSS 120B",
    description:
      "Large open-weight model with reasoning capabilities - Production ready",
    maxTokens: 65536,
    supportsCitations: false,
    supportsReasoning: true,
    provider: groq("openai/gpt-oss-120b"),
    providerOptions: {
      groq: {
        reasoningFormat: "parsed",
      },
    },
    icon: Cpu,
  },
  "openai/gpt-oss-20b": {
    name: "GPT OSS 20B",
    description:
      "Smaller open-weight model with high reasoning power - Production ready",
    maxTokens: 65536,
    supportsCitations: false,
    supportsReasoning: true,
    provider: groq("openai/gpt-oss-20b"),
    providerOptions: {
      groq: {
        reasoningFormat: "parsed",
      },
    },
    icon: Cpu,
  },
} as const;
