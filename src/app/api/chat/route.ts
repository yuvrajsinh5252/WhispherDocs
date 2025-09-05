import { authenticateUser, validateAndGetFile } from "@/lib/chat-api/auth";
import {
  saveUserMessage,
  handleErrorAndCleanup,
  getLastUserMessage,
} from "@/lib/chat-api/messages";
import { DEFAULT_MODEL } from "@/lib/chat-api/constants";
import handleChatRequest from "@/lib/chat-api/chatRequest";
import { UIMessage } from "ai";
import createChatMessages from "@/lib/chat-api/prompt";
import { ModelId } from "@/lib/chat-api/models";

export const maxDuration = 60;

export const POST = async (req: Request) => {
  const data = await req.json();
  const {
    messages,
    fileId,
    model,
  }: { messages: UIMessage[]; fileId: string; model: string } = data;
  const user_message = getLastUserMessage(messages);

  if (!user_message) {
    return new Response(JSON.stringify({ error: "No user message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { user, error: authError } = await authenticateUser();
  if (authError) return authError;

  const selectedModel = (model as ModelId) || DEFAULT_MODEL;

  const { file, error: fileError } = await validateAndGetFile(fileId, user.id);
  if (fileError) return fileError;

  try {
    await saveUserMessage(user_message, user.id, fileId);
  } catch (error) {
    console.error("Failed to save user message");
  }

  try {
    const chatMessages = await createChatMessages(messages, file.id);

    const result = await handleChatRequest(
      chatMessages,
      selectedModel,
      user.id,
      file.id
    );

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    return await handleErrorAndCleanup(error, user.id, fileId, user_message);
  }
};
