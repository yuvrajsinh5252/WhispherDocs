import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { type GroqModelId } from "./constants";
import { createGroqChatConfig } from "../../lib/message-api/chat-config";
import { saveAssistantMessage } from "../../lib/message-api/messages";
import processGroqCitations from "./citationProcessor";

interface GroqHandlerParams {
  selectedModel: GroqModelId;
  needsDocumentContext: boolean;
  formattedHistory: string;
  searchResults: any[];
  message: string;
  file: { id: string; name: string };
  userId: string;
}

export async function handleGroqRequest({
  selectedModel,
  needsDocumentContext,
  formattedHistory,
  searchResults,
  message,
  file,
  userId,
}: GroqHandlerParams): Promise<Response> {
  const groqConfig = createGroqChatConfig(
    selectedModel,
    needsDocumentContext,
    formattedHistory,
    searchResults,
    message
  );

  const response = streamText({
    model: groq(selectedModel),
    providerOptions: {
      groq: {
        reasoningFormat: "parsed",
        user: userId,
      },
    },
    messages: groqConfig.messages,
    temperature: 0.2,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await processGroqCitations(
          response,
          controller,
          file.name
        );

        const messageSaved = await saveAssistantMessage(
          result.finalMessage,
          result.thinking || "",
          userId,
          file.id
        );

        if (!messageSaved) {
          console.error("Failed to save assistant message");
        }

        controller.close();
      } catch (error) {
        console.error("Error processing citations:", error);
        try {
          controller.error(error);
        } catch (controllerError) {
          console.error("Error closing controller:", controllerError);
        }
      }
    },
  });

  return new Response(stream);
}
