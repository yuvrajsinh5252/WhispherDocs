import { UIMessage } from "@ai-sdk/react";

// Type for DB message from TRPC endpoint
export interface DBMessage {
  id: string;
  text: string;
  createdAt: string | Date; // Can be either string or Date
  isUserMessage: boolean;
  hasThinking: boolean;
}

/**
 * Normalizes a database message to a UIMessage format that's compatible with AI SDK components
 * @param dbMessage - The message from the database
 * @param thinking - Optional thinking content for assistant messages
 * @returns UIMessage compatible with AI SDK components
 */
export function normalizeDBMessageToUIMessage(
  dbMessage: DBMessage,
  thinking?: string | null
): UIMessage {
  const role = dbMessage.isUserMessage ? "user" : "assistant";

  if (dbMessage.isUserMessage) {
    // For user messages, just create a simple text part
    return {
      id: dbMessage.id,
      role: "user",
      parts: [
        {
          type: "text",
          text: dbMessage.text,
        },
      ],
    };
  } else {
    // For assistant messages, create parts array with text and optionally reasoning
    const parts: UIMessage["parts"] = [
      {
        type: "text",
        text: dbMessage.text,
      },
    ];

    // Add reasoning part if thinking content exists
    if (dbMessage.hasThinking && thinking) {
      parts.push({
        type: "reasoning",
        text: thinking,
      });
    }

    return {
      id: dbMessage.id,
      role: "assistant",
      parts,
    };
  }
}

/**
 * Normalizes an array of database messages to UIMessage format
 * @param dbMessages - Array of messages from the database
 * @param thinkingMap - Optional map of message IDs to their thinking content
 * @returns Array of UIMessage compatible with AI SDK components
 */
export function normalizeDBMessagesToUIMessages(
  dbMessages: DBMessage[],
  thinkingMap?: Record<string, string>
): UIMessage[] {
  return dbMessages.map((dbMessage) =>
    normalizeDBMessageToUIMessage(dbMessage, thinkingMap?.[dbMessage.id])
  );
}

/**
 * Simple function to combine normalized DB messages with UI messages
 * @param dbMessages - Array of messages from the database
 * @param uiMessages - Array of current UI messages
 * @param thinkingMap - Optional map of message IDs to their thinking content
 * @returns Combined array of UIMessage compatible with AI SDK components
 */
export function combineNormalizedMessages(
  dbMessages: DBMessage[],
  uiMessages: UIMessage[],
  thinkingMap?: Record<string, string>
): UIMessage[] {
  // Normalize DB messages to UI format
  const normalizedDBMessages = normalizeDBMessagesToUIMessages(
    dbMessages,
    thinkingMap
  );

  // Filter out any UI messages that might already exist in DB messages
  const dbMessageIds = new Set(normalizedDBMessages.map((msg) => msg.id));
  const uniqueUIMessages = uiMessages.filter(
    (msg) => !dbMessageIds.has(msg.id)
  );

  // Combine them (DB messages first, then new UI messages)
  return [...normalizedDBMessages, ...uniqueUIMessages];
}

/**
 * Converts a UIMessage back to a format suitable for database storage
 * This is useful when you need to save UIMessages to the database
 */
export function denormalizeUIMessageToDBFormat(uiMessage: UIMessage): {
  text: string;
  thinking?: string;
  hasThinking: boolean;
  isUserMessage: boolean;
} {
  const isUserMessage = uiMessage.role === "user";

  // Extract text content from parts
  const textParts = uiMessage.parts.filter((part) => part.type === "text");
  const text = textParts.map((part) => part.text).join(" ");

  // Extract reasoning/thinking content
  const reasoningParts = uiMessage.parts.filter(
    (part) => part.type === "reasoning"
  );
  const thinking =
    reasoningParts.length > 0
      ? reasoningParts.map((part) => part.text).join(" ")
      : undefined;

  return {
    text,
    thinking,
    hasThinking: !!thinking,
    isUserMessage,
  };
}
