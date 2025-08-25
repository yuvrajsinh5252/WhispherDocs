import { NextRequest } from "next/server";
import { MessageValidator } from "@/lib/validator/MessageValidator";
import {
  validateEnvironment,
  authenticateUser,
  validateAndGetFile,
} from "@/lib/message-api/auth";
import {
  saveUserMessage,
  getMessageHistory,
  handleErrorAndCleanup,
} from "@/lib/message-api/messages";
import {
  searchDocumentContext,
  classifyQuery,
  prepareDocumentChunks,
} from "@/lib/message-api/document-search";
import {
  DEFAULT_MODEL,
  ALL_MODELS,
  type ModelId,
} from "@/lib/message-api/constants";
import { handleGroqRequest } from "@/services/groq/handler";
import { handleCohereRequest } from "@/services/cohere/handler";

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

  let fileId: string, message: string, selectedModel: ModelId;
  try {
    const parsed = MessageValidator.parse(body);
    fileId = parsed.fileId;
    message = parsed.message;
    selectedModel = (parsed.model as ModelId) || DEFAULT_MODEL;
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

    const needsDocumentContext = await classifyQuery(
      message,
      searchResults,
      selectedModel
    );

    const documentChunks = prepareDocumentChunks(searchResults, file.name);
    const modelConfig = ALL_MODELS[selectedModel];

    if (modelConfig.provider === "groq") {
      return await handleGroqRequest({
        selectedModel: selectedModel as any,
        needsDocumentContext,
        formattedHistory,
        searchResults,
        message,
        file,
        userId: user.id,
      });
    } else {
      return await handleCohereRequest({
        selectedModel: selectedModel as any,
        needsDocumentContext,
        formattedHistory,
        searchResults,
        message,
        documentChunks,
        file,
        userId: user.id,
      });
    }
  } catch (error) {
    return await handleErrorAndCleanup(error, user.id, fileId, message);
  }
};
