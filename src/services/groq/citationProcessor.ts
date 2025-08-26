import { StreamTextResult } from "ai";

async function processGroqCitations(
  response: StreamTextResult<any, any>,
  controller: ReadableStreamDefaultController,
  fileName: string
): Promise<{ finalMessage: string; thinking?: string }> {
  let finalMessage = "";
  let thinkingBuffer = "";
  let isStreamingThinking = false;
  let isStreamingText = false;

  for await (const event of response.fullStream) {
    if (event.type === "reasoning-start") {
      isStreamingThinking = true;
      thinkingBuffer = "";
    } else if (event.type === "reasoning-delta") {
      if (isStreamingThinking && event.text) {
        thinkingBuffer += event.text;
        const thinkingChunk =
          JSON.stringify({
            type: "thinking",
            content: event.text,
          }) + "\n";
        controller.enqueue(thinkingChunk);
      }
    } else if (event.type === "reasoning-end") {
      isStreamingThinking = false;
    } else if (event.type === "text-start") {
      isStreamingText = true;
      finalMessage = "";
    } else if (event.type === "text-delta") {
      if (isStreamingText && event.text) {
        finalMessage += event.text;
        controller.enqueue(event.text);
      }
    } else if (event.type === "text-end") {
      isStreamingText = false;
    }
  }

  return {
    finalMessage,
    thinking: thinkingBuffer,
  };
}

export default processGroqCitations;
