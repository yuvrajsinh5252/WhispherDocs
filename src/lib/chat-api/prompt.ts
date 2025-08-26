import { UIMessage } from "ai";

const SYSTEM_PROMPT = `You are an expert assistant that helps users understand and analyze documents.

When answering questions:
1. Use the provided document context to give accurate, relevant answers
2. Cite specific parts of the document when supporting your claims
3. Be concise but comprehensive in your explanations
4. If the document doesn't contain enough information to fully answer the question, say so clearly
5. Reference page numbers, sections, or specific quotes when relevant

Always maintain a helpful, professional tone and focus on providing value through document insights.`;

export function createChatMessages(
  uiMessages: UIMessage[],
  userMessage: string
): UIMessage[] {
  const messages: UIMessage[] = [];

  messages.push({
    id: "system-message",
    role: "system",
    parts: [{ type: "text", text: SYSTEM_PROMPT }],
  });

  messages.push(...uiMessages);

  messages.push({
    id: "user-message",
    role: "user",
    parts: [{ type: "text", text: userMessage }],
  });

  return messages;
}

export default createChatMessages;
