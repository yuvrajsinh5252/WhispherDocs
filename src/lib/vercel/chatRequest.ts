import {
  streamText,
  convertToModelMessages,
  UIMessage,
  StreamTextResult,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { cohere } from "@ai-sdk/cohere";
import { ModelId, GROQ_MODELS, COHERE_MODELS } from "@/lib/chat-api/constants";

async function handleChatRequest(
  messages: UIMessage[],
  selectedModel: ModelId
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
      console.log("Stream finished:", {
        text: text?.slice(0, 100) + "...",
        finishReason,
        usage,
      });
    },
  });

  return result;
}

export default handleChatRequest;
