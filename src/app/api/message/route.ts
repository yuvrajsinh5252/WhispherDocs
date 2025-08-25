import { NextRequest } from "next/server";
import { MessageValidator } from "@/lib/validator/MessageValidator";
import { CohereClientV2 } from "cohere-ai";
import { processCitationsInStream } from "@/lib/citationProcessor";
import {
  validateEnvironment,
  authenticateUser,
  validateAndGetFile,
} from "@/lib/message-api/auth";
import {
  saveUserMessage,
  getMessageHistory,
  saveAssistantMessage,
  handleErrorAndCleanup,
} from "@/lib/message-api/messages";
import {
  searchDocumentContext,
  classifyQuery,
  prepareDocumentChunks,
} from "@/lib/message-api/document-search";
import { createChatConfig } from "@/lib/message-api/chat-config";
import { DEFAULT_MODEL } from "@/lib/message-api/constants";

export const maxDuration = 59;

export const POST = async (req: NextRequest) => {
  if (!validateEnvironment()) {
    console.error("Missing required environment variables");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Invalid JSON in request body:", error);
    return new Response(JSON.stringify({ error: "Invalid request format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { user, error: authError } = await authenticateUser();
  if (authError) return authError;

  let fileId: string, message: string, selectedModel: string;
  try {
    const parsed = MessageValidator.parse(body);
    fileId = parsed.fileId;
    message = parsed.message;
    selectedModel = parsed.model || DEFAULT_MODEL;
  } catch (error) {
    console.error("Invalid request data:", error);
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { file, error: fileError } = await validateAndGetFile(fileId, user.id);
  if (fileError) return fileError;

  const messageSaved = await saveUserMessage(message, user.id, fileId);
  if (!messageSaved) {
    console.error("Failed to save user message");
  }

  try {
    const searchResults = await searchDocumentContext(message, file.id);
    const formattedHistory = await getMessageHistory(file.id);
    const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
    const needsDocumentContext = await classifyQuery(
      message,
      searchResults,
      cohere
    );
    const documentChunks = prepareDocumentChunks(searchResults, file.name);
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
            user.id,
            fileId
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
  } catch (error) {
    return await handleErrorAndCleanup(error, user.id, fileId, message);
  }
};
