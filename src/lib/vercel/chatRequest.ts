import {
  streamText,
  convertToModelMessages,
  UIMessage,
  StreamTextResult,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { cohere } from "@ai-sdk/cohere";
import { ModelId, GROQ_MODELS, COHERE_MODELS } from "@/lib/chat-api/constants";
import { saveAssistantMessage } from "../chat-api/messages";

async function handleChatRequest(
  messages: UIMessage[],
  selectedModel: ModelId,
  userId: string,
  fileId: string
): Promise<StreamTextResult<any, any>> {
  let modelProvider;

  if (GROQ_MODELS[selectedModel as keyof typeof GROQ_MODELS]) {
    modelProvider = groq(selectedModel);
  } else if (COHERE_MODELS[selectedModel as keyof typeof COHERE_MODELS]) {
    modelProvider = cohere(selectedModel);
  } else {
    modelProvider = groq("deepseek-r1-distill-llama-70b");
  }

  const result = streamText({
    model: modelProvider,
    messages: convertToModelMessages(messages),
    temperature: 0.2,
    onFinish: async ({ text, finishReason, usage }) => {
      let thinking = "";
      await saveAssistantMessage(text, thinking, userId, fileId);
    },
  });

  return result;
}

export default handleChatRequest;
