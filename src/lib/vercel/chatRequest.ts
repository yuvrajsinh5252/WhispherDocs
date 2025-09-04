import {
  streamText,
  convertToModelMessages,
  UIMessage,
  StreamTextResult,
} from "ai";
import { saveAssistantMessage } from "../chat-api/messages";
import { ModelId, MODELS } from "../chat-api/models";

async function handleChatRequest(
  messages: UIMessage[],
  selectedModel: ModelId,
  userId: string,
  fileId: string
): Promise<StreamTextResult<any, any>> {
  const result = streamText({
    model: MODELS[selectedModel].provider,
    providerOptions: {
      groq: {
        reasoningFormat: "parsed",
        user: userId,
      },
      google: {
        thinkingConfig: {
          thinkingBudget: 3000,
          includeThoughts: true,
        },
      },
    },
    messages: convertToModelMessages(messages),
    temperature: 0.2,
    onFinish: async (response) => {
      console.log(response);
      // await saveAssistantMessage(text, thinking, userId, fileId);
    },
  });

  return result;
}

export default handleChatRequest;
