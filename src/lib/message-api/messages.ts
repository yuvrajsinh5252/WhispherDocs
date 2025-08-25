import { db } from "@/db";
import { MESSAGE_HISTORY_LIMIT, ERROR_MESSAGES } from "./constants";

export async function saveUserMessage(
  message: string,
  userId: string,
  fileId: string
): Promise<boolean> {
  try {
    await db.messages.create({
      data: {
        text: message,
        isUserMessage: true,
        userId: userId,
        fileId: fileId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error saving user message:", error);
    return false;
  }
}

export async function getMessageHistory(fileId: string): Promise<string> {
  try {
    const prevMessages = await db.messages.findMany({
      where: { fileId: fileId },
      orderBy: { createdAt: "desc" },
      take: MESSAGE_HISTORY_LIMIT,
    });

    return prevMessages
      .reverse()
      .map((m) => `${m.isUserMessage ? "Human" : "Assistant"}: ${m.text}`)
      .join("\n\n");
  } catch (error) {
    console.error("Message history error:", error);
    return "";
  }
}

export async function saveAssistantMessage(
  text: string,
  thinking: string,
  userId: string,
  fileId: string
): Promise<boolean> {
  try {
    await db.messages.create({
      data: {
        text,
        thinking,
        isUserMessage: false,
        userId,
        fileId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error saving assistant message:", error);
    return false;
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
