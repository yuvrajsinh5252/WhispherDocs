import { V2ChatStreamRequest } from "cohere-ai/api";
import { DEFAULT_TEMPERATURE, ALL_MODELS, type ModelId } from "./constants";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function getCapabilityDescription(modelConfig: any): string {
  if (modelConfig.supportsReasoning) return "advanced reasoning";
  if (modelConfig.name.toLowerCase().includes("aya"))
    return "multilingual and culturally-aware";
  return "efficient processing";
}

function getCapabilityInstructions(modelConfig: any): string {
  const instructions: string[] = [];

  if (modelConfig.supportsCitations) {
    instructions.push(`CITATION CAPABILITIES:
- When referencing document content, use [1], [2], etc. to cite sources
- Provide specific page references when available
- Maintain clear connection between claims and sources`);
  }

  if (modelConfig.supportsReasoning) {
    instructions.push(`REASONING CAPABILITIES:
- Use <think> tags to show your step-by-step reasoning process
- Break down complex problems into logical steps
- Explain your analytical approach before providing conclusions
- Show confidence levels for analytical conclusions
- Use multi-step logical analysis for complex questions`);
  }

  if (modelConfig.name.toLowerCase().includes("aya")) {
    instructions.push(`MULTILINGUAL CAPABILITIES:
- Detect and respond in the user's preferred language
- Handle documents in multiple languages naturally
- Provide culturally appropriate responses`);
  }

  return instructions.join("\n\n");
}

export function getUnifiedPrompt(
  selectedModel: ModelId,
  needsDocumentContext: boolean,
  formattedHistory: string,
  searchResults: any[],
  message: string
): string {
  const modelConfig = ALL_MODELS[selectedModel];
  const capability = getCapabilityDescription(modelConfig);
  const capabilityInstructions = getCapabilityInstructions(modelConfig);

  const documentContext = needsDocumentContext
    ? `\n\nRELEVANT DOCUMENT CONTENT:
${searchResults.map((r) => r.pageContent || "").join("\n\n")}`
    : "";

  return `You are a helpful document assistant powered by ${
    modelConfig.name
  } with ${capability} capabilities.

CORE INSTRUCTIONS:
1. Your primary function is to help users understand their document content
2. Prioritize information from the document when answering specific questions about its content
3. Handle conversational queries naturally while keeping focus on helping with the document
4. Format responses with markdown for better readability when appropriate
5. Be concise but comprehensive in your answers

${capabilityInstructions}

RECENT CONVERSATION:
${formattedHistory}${documentContext}

Please answer the user's ${
    needsDocumentContext ? "document-related question" : "general question"
  } in a helpful and informative way using your ${capability} capabilities.

USER QUESTION: ${message}`.trim();
}

export function createGroqChatConfig(
  selectedModel: ModelId,
  needsDocumentContext: boolean,
  formattedHistory: string,
  searchResults: any[],
  message: string
): { messages: ChatMessage[] } {
  const modelConfig = ALL_MODELS[selectedModel];

  // Base system message
  const systemMessage = `You are a helpful document assistant powered by ${
    modelConfig.name
  } with ${getCapabilityDescription(modelConfig)} capabilities.

CORE INSTRUCTIONS:
1. Your primary function is to help users understand their document content
2. Prioritize information from the document when answering specific questions about its content
3. Handle conversational queries naturally while keeping focus on helping with the document
4. Format responses with markdown for better readability when appropriate
5. Be concise but comprehensive in your answers

${getCapabilityInstructions(modelConfig)}

RECENT CONVERSATION:
${formattedHistory}`;

  // Create messages array
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemMessage,
    },
    {
      role: "user",
      content: message,
    },
  ];

  // Handle document context and citations for Groq models
  if (needsDocumentContext && modelConfig.supportsCitations) {
    // Add citation instructions to system message
    messages[0].content += `

CITATION INSTRUCTIONS:
When referencing information from the document context, use numbered citations like [1], [2], etc.
Match the citation numbers to the document chunks provided in the context.
Always provide citations when making specific claims about the document content.`;

    // Add document context to user message
    const contextText = searchResults
      .map((result, index) => `[Document ${index + 1}]: ${result.pageContent}`)
      .join("\n\n");

    messages[1].content += `\n\nDOCUMENT CONTEXT:\n${contextText}`;
  }

  return { messages };
}

export function createCohereChatConfig(
  selectedModel: ModelId,
  needsDocumentContext: boolean,
  formattedHistory: string,
  searchResults: any[],
  message: string,
  documentChunks: any[]
): V2ChatStreamRequest {
  const modelConfig = ALL_MODELS[selectedModel];

  if (modelConfig.provider === "groq") {
    throw new Error("Use createGroqChatConfig for Groq models");
  }

  const config: V2ChatStreamRequest = {
    model: selectedModel,
    temperature: DEFAULT_TEMPERATURE,
    messages: [
      {
        role: "user",
        content: getUnifiedPrompt(
          selectedModel,
          needsDocumentContext,
          formattedHistory,
          searchResults,
          message
        ),
      },
    ],
  };

  if (selectedModel === "command-a-reasoning-08-2025") {
    (config as any).thinking = {
      type: "enabled" as const,
      token_budget: 1000,
    };
  }

  if (needsDocumentContext) {
    config.documents = documentChunks;
    config.citationOptions = { mode: "FAST" };
  }

  return config;
}
