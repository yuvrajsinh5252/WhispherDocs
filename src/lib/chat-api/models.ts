import { groq } from "@ai-sdk/groq";
import { cohere } from "@ai-sdk/cohere";
import { google } from "@ai-sdk/google";
import { Brain, Cpu } from "lucide-react";
import { Languages } from "lucide-react";

export type ModelId = keyof typeof MODELS;

export const MODELS = {
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill 70B",
    description: "Advanced reasoning model with step-by-step thinking",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: groq("deepseek-r1-distill-llama-70b"),
    icon: Cpu,
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    description: "Most capable Llama model with enhanced reasoning",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: groq("llama-3.3-70b-versatile"),
    icon: Cpu,
  },
  "llama-3.1-70b-versatile": {
    name: "Llama 3.1 70B",
    description: "Advanced reasoning with large context",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: groq("llama-3.1-70b-versatile"),
    icon: Cpu,
  },
  "llama-3.1-8b-instant": {
    name: "Llama 3.1 8B",
    description: "Fast and efficient for quick responses",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: false,
    provider: groq("llama-3.1-8b-instant"),
    icon: Cpu,
  },
  "mixtral-8x7b-32768": {
    name: "Mixtral 8x7B",
    description: "Expert mixture model with strong performance",
    maxTokens: 32768,
    supportsCitations: true,
    supportsReasoning: true,
    provider: groq("mixtral-8x7b-32768"),
    icon: Cpu,
  },
  "gemma2-9b-it": {
    name: "Gemma 2 9B",
    description: "Google's lightweight model",
    maxTokens: 8192,
    supportsCitations: false,
    supportsReasoning: false,
    provider: groq("gemma2-9b-it"),
    icon: Cpu,
  },
  "gemini-2.5-flash": {
    name: "gemini 2.5 flash",
    description: "Google's fast reasoning model",
    maxTokens: 0,
    supportsCitations: true,
    supportsReasoning: true,
    provider: google("gemini-2.0-flash-exp"),
    icon: Cpu,
  },
  "command-a-reasoning-08-2025": {
    name: "Command A Reasoning",
    description: "Advanced reasoning with agentic capabilities",
    maxTokens: 256000,
    supportsCitations: true,
    supportsReasoning: true,
    provider: cohere("command-a-reasoning-08-2025"),
    icon: Brain,
  },
  "c4ai-aya-expanse-32b": {
    name: "Aya Expanse",
    description:
      "Aya Expanse is a 32B multilingual model with monolingual-level performance in 23 languages.",
    maxTokens: 128000,
    supportsCitations: true,
    supportsReasoning: false,
    provider: cohere("c4ai-aya-expanse-32b"),
    icon: Languages,
  },
} as const;
