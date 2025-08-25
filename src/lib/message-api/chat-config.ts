import { V2ChatStreamRequest } from "cohere-ai/api";
import { DEFAULT_TEMPERATURE, THINKING_TOKEN_BUDGET } from "./constants";

export function getSystemPrompt(selectedModel: string): string {
  const isAya = selectedModel === "aya";

  return `You are a helpful document assistant powered by ${
    isAya ? "Aya" : "Command A Reasoning"
  } with advanced ${isAya ? "multilingual" : "reasoning"} capabilities.

  INSTRUCTIONS:
  1. Your primary function is to help users understand their document content.
  2. Prioritize information from the document when answering specific questions about its content.
  3. Handle conversational queries naturally while keeping focus on helping with the document.
  4. Format responses with markdown for better readability when appropriate.
  5. Be concise but comprehensive in your answers.

  ${
    isAya
      ? `MULTILINGUAL CAPABILITIES:
      - Detect and respond in the user's preferred language
      - Handle documents in multiple languages naturally
      - Provide culturally appropriate responses`
      : `ADVANCED REASONING CAPABILITIES:
      - Use multi-step logical analysis for complex questions
      - Provide confidence levels for analytical conclusions
      - Show clear thinking process in responses`
  }`;
}

export function getUserPrompt(
  selectedModel: string,
  needsDocumentContext: boolean,
  formattedHistory: string,
  searchResults: any[],
  message: string
): string {
  const isAya = selectedModel === "aya";
  const capabilityType = isAya
    ? "multilingual and culturally-aware"
    : "advanced reasoning";

  if (needsDocumentContext) {
    return `Answer the user's question in a helpful and informative way using your ${capabilityType} capabilities.

    RECENT CONVERSATION:
    ${formattedHistory}

    Document context (use when relevant to the user's question):
    ${searchResults.map((r) => r.pageContent || "").join("\n\n")}

    USER QUESTION: ${message}`;
  }

  return `Answer the user's general question using your ${capabilityType} capabilities.

  RECENT CONVERSATION:
  ${formattedHistory}

  USER QUESTION: ${message}`;
}

export function createChatConfig(
  selectedModel: string,
  needsDocumentContext: boolean,
  formattedHistory: string,
  searchResults: any[],
  message: string,
  documentChunks: any[]
): V2ChatStreamRequest {
  const config: V2ChatStreamRequest = {
    model: selectedModel,
    temperature: DEFAULT_TEMPERATURE,
    ...(selectedModel === "command-a-reasoning-08-2025" && {
      thinking: {
        type: "enabled" as const,
        token_budget: THINKING_TOKEN_BUDGET,
      },
    }),
    messages: [
      {
        role: "system",
        content: getSystemPrompt(selectedModel),
      },
      {
        role: "user",
        content: getUserPrompt(
          selectedModel,
          needsDocumentContext,
          formattedHistory,
          searchResults,
          message
        ),
      },
    ],
  };

  if (needsDocumentContext) {
    config.documents = documentChunks;
    config.citationOptions = { mode: "FAST" };
  }

  return config;
}
