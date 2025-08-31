import {
  validateEnvironment,
  authenticateUser,
  validateAndGetFile,
} from "@/lib/chat-api/auth";
import {
  saveUserMessage,
  handleErrorAndCleanup,
  getLastUserMessageWithMeta,
} from "@/lib/chat-api/messages";
import { DEFAULT_MODEL, type ModelId } from "@/lib/chat-api/constants";
import handleChatRequest from "@/lib/vercel/chatRequest";
import { searchDocumentContext } from "@/lib/chat-api/document-search";
import { UIMessage } from "ai";
import createChatMessages from "@/lib/chat-api/prompt";

export const maxDuration = 30;

export const POST = async (req: Request) => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const {
    text: user_message,
    fileId,
    model,
  } = getLastUserMessageWithMeta(messages);

  if (!user_message) {
    return new Response(JSON.stringify({ error: "No user message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!validateEnvironment()) {
    console.error("Missing required environment variables");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { user, error: authError } = await authenticateUser();
  if (authError) return authError;

  const selectedModel = (model as ModelId) || DEFAULT_MODEL;

  const { file, error: fileError } = await validateAndGetFile(fileId, user.id);
  if (fileError) return fileError;

  try {
    // await saveUserMessage(user_message, user.id, fileId);
  } catch (error) {
    console.error("Failed to save user message");
  }

  try {
    const searchResults = await searchDocumentContext(user_message, file.id);

    const chatMessages = createChatMessages(
      [...messages, searchResults],
      user_message
    );

    const result = await handleChatRequest(chatMessages, selectedModel);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return await handleErrorAndCleanup(error, user.id, fileId, user_message);
  }
};
