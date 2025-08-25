import { CohereClientV2 } from "cohere-ai";
import { processCitationsInStream } from "./citationProcessor";
import { createChatConfig } from "../../lib/message-api/chat-config";
import { saveAssistantMessage } from "../../lib/message-api/messages";
import { type CohereModelId } from "./constants";

interface CohereHandlerParams {
  selectedModel: CohereModelId;
  needsDocumentContext: boolean;
  formattedHistory: string;
  searchResults: any[];
  message: string;
  documentChunks: any[];
  file: { id: string; name: string };
  userId: string;
}

export async function handleCohereRequest({
  selectedModel,
  needsDocumentContext,
  formattedHistory,
  searchResults,
  message,
  documentChunks,
  file,
  userId,
}: CohereHandlerParams): Promise<Response> {
  const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
  const chatConfig = createChatConfig(
    selectedModel,
    needsDocumentContext,
    formattedHistory,
    searchResults,
    message,
    documentChunks
  );

  const response = await cohere.chatStream(chatConfig);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await processCitationsInStream(
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
