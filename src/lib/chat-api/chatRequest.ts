import {
  streamText,
  convertToModelMessages,
  UIMessage,
  StreamTextResult,
} from "ai";
import { saveAssistantMessage } from "./messages";
import { ModelId, MODELS } from "./models";

async function handleChatRequest(
  messages: UIMessage[],
  selectedModel: ModelId,
  userId: string,
  fileId: string
): Promise<StreamTextResult<any, any>> {
  const result = streamText({
    model: MODELS[selectedModel].provider,
    providerOptions: MODELS[selectedModel].providerOptions,
    messages: convertToModelMessages(messages),
    temperature: 0.4,
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
