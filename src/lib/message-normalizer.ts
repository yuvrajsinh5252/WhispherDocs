import { UIMessage } from "@ai-sdk/react";

// Type for DB message from TRPC endpoint
export interface DBMessage {
  id: string;
  text: string;
  createdAt: string | Date;
  isUserMessage: boolean;
  thinking?: string | null;
}

/**
 * Normalizes a database message to a UIMessage format
 */
function normalizeDBMessageToUIMessage(dbMessage: DBMessage): UIMessage {
  if (dbMessage.isUserMessage) {
    return {
      id: dbMessage.id,
      role: "user",
      parts: [{ type: "text", text: dbMessage.text }],
    };
  }

  const parts: UIMessage["parts"] = [{ type: "text", text: dbMessage.text }];

  // Add reasoning part if thinking content exists
  if (dbMessage.thinking?.trim()) {
    parts.push({ type: "reasoning", text: dbMessage.thinking });
  }

  return {
    id: dbMessage.id,
    role: "assistant",
    parts,
  };
}

/**
 * Combines database messages with UI messages, avoiding duplicates
 */
export function combineNormalizedMessages(
  dbMessages: DBMessage[],
  uiMessages: UIMessage[]
): UIMessage[] {
  // Normalize DB messages to UI format
  const normalizedDBMessages = dbMessages.map(normalizeDBMessageToUIMessage);

  // Filter out UI messages that already exist in DB messages
  const dbMessageIds = new Set(normalizedDBMessages.map((msg) => msg.id));
  const uniqueUIMessages = uiMessages.filter(
    (msg) => !dbMessageIds.has(msg.id)
  );

  // Combine them (DB messages first, then new UI messages)
  return [...normalizedDBMessages, ...uniqueUIMessages];
}
