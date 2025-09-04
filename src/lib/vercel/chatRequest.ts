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
    },
    messages: convertToModelMessages([messages[messages.length - 1]]),
    temperature: 0.2,
    onFinish: async (response) => {
      await saveAssistantMessage(
        response.text,
        response.reasoningText || "",
        userId,
        fileId
      );
    },
  });

  return result;
}

export default handleChatRequest;
