import { UIMessage } from "ai";
import { searchDocumentContext } from "./document-search";
import { getLastUserMessage } from "./messages";

const SYSTEM_PROMPT = `You are an intelligent document analysis assistant with expertise in making informed inferences and educated assessments based on document content.

When answering questions:
1. Primary: Use the provided document context to give accurate, relevant answers
2. Secondary: When information isn't explicitly stated, make reasonable inferences based on available context (education level, experience, location, industry standards, etc.)
3. Be Analytical: Connect dots between different pieces of information to provide comprehensive insights
4. Acknowledge Uncertainty**: When making educated guesses, clearly indicate these are estimates based on available information
5. Provide Context: Explain your reasoning when making inferences (e.g., "Based on his education level and experience with...")

For example:
- If asked about salary expectations but not explicitly stated, estimate based on education, experience level, location, and industry standards
- If asked about skills not directly mentioned, infer from projects and experiences described
- If asked about career goals, deduce from the trajectory and achievements shown

Always cite specific document sections that support your analysis, and clearly distinguish between explicit facts and reasonable inferences.`;

export async function createChatMessages(
  uiMessages: UIMessage[],
  fileId: string
): Promise<UIMessage[]> {
  const messages: UIMessage[] = [];

  messages.push({
    id: "system-message",
    role: "system",
    parts: [{ type: "text", text: SYSTEM_PROMPT }],
  });

  const user_message = getLastUserMessage(uiMessages);
  if (user_message) {
    const documentContextMessage = await searchDocumentContext(
      user_message,
      fileId
    );
    messages.push(documentContextMessage);
  }

  const conversationHistory = uiMessages.slice(0, -1);
  messages.push(...conversationHistory);
  messages.push(uiMessages[uiMessages.length - 1]);

  return messages;
}

export default createChatMessages;
