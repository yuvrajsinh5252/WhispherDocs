import { UIMessage } from "ai";
import { ModelId } from "./models";
import { db } from "@/db";
import { ERROR_MESSAGES } from "./constants";

export async function saveUserMessage(
  message: string,
  userId: string,
  fileId: string
): Promise<string> {
  try {
    const savedMessage = await db.messages.create({
      data: {
        text: message,
        isUserMessage: true,
        userId: userId,
        fileId: fileId,
      },
    });
    return savedMessage.id;
  } catch (error) {
    console.error("Error saving user message:", error);
    throw new Error("Failed to save user message");
  }
}

export async function saveAssistantMessage(
  text: string,
  thinking: string,
  userId: string,
  fileId: string
): Promise<string> {
  try {
    const savedMessage = await db.messages.create({
      data: {
        text,
        thinking,
        isUserMessage: false,
        userId,
        fileId,
      },
    });
    return savedMessage.id;
  } catch (error) {
    console.error("Error saving assistant message:", error);
    throw new Error("Failed to save assistant message");
  }
}

export async function handleErrorAndCleanup(
  error: any,
  userId: string,
  fileId: string,
  userMessage: string
): Promise<Response> {
  console.error("API route error:", error);

  try {
    await db.messages.create({
      data: {
        text: ERROR_MESSAGES.PROCESSING_ERROR,
        isUserMessage: false,
        userId: userId,
        fileId: fileId,
      },
    });

    await db.messages.deleteMany({
      where: {
        userId: userId,
        fileId: fileId,
        isUserMessage: true,
        text: userMessage,
      },
    });
  } catch (cleanupError) {
    console.error("Error during cleanup:", cleanupError);
  }

  return new Response(JSON.stringify({ error: ERROR_MESSAGES.GENERAL_ERROR }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

export function getLastUserMessage(messages: UIMessage[]): string {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user") as
    | (UIMessage & { metadata?: { fileId?: string; model?: ModelId } })
    | undefined;

  if (!lastUserMsg) throw new Error("No new user message found");

  const textPart = lastUserMsg.parts.find((part) => part.type === "text") as
    | { type: "text"; text: string }
    | undefined;

  if (!textPart) throw new Error("No text found in last use message");

  return textPart.text;
}
