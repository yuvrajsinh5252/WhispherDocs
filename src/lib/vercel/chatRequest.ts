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
  userId: string,
  selectedModel: ModelId
): Promise<{
  result: StreamTextResult<any, any>;
  text: string;
  thinking: string;
}> {
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
  });

  let text = "";
  let thinking = "";

  for await (const chunk of result.fullStream) {
    if (chunk.type === "text-delta") {
      text += chunk.text;
    } else if (chunk.type === "reasoning-delta") {
      thinking += chunk.text;
    }
  }

  return { result, text, thinking };
}

export default handleChatRequest;
