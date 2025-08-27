import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useChatStore } from "@/stores/chatStore";
import { ChatStatus } from "ai";

export default function ChatInput({
  status,
  sendMessage,
}: {
  status: ChatStatus;
  sendMessage: any;
}) {
  const { message, setUserMessage, fileId, selectedModel } = useChatStore();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useScreenSize();
  const isBusy = status === "submitted" || status === "streaming";

  const handleSendMessage = () => {
    sendMessage({
      text: message,
      metadata: { fileId: fileId, model: selectedModel },
    });
    setUserMessage("");
  };

  useEffect(() => {
    if (!isMobile && textAreaRef.current && status === "ready") {
      textAreaRef.current.focus();
    }
  }, [isMobile, status]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      const scrollHeight = textAreaRef.current.scrollHeight;
      const maxHeight = isMobile ? 120 : 160;
      textAreaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [message, isMobile]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative mb-3">
        <div className="relative rounded-xl border-0 shadow-lg bg-gray-800/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:bg-gray-800/70 transition-all duration-300">
          <Textarea
            placeholder="Ask a question..."
            ref={textAreaRef}
            rows={1}
            maxRows={isMobile ? 3 : 4}
            value={message}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isBusy}
            className={cn(
              "min-h-[56px] w-full resize-none border-0 bg-transparent py-4 pl-4 pr-16 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-relaxed text-gray-100 placeholder-gray-400 transition-colors duration-200 rounded-xl",
              isBusy && "text-gray-500",
              !isBusy && "hover:placeholder-gray-300"
            )}
          />

          <div className="absolute right-3 bottom-3">
            <Button
              size="sm"
              type="submit"
              disabled={!message.trim() || isBusy}
              onClick={handleSendMessage}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-300 shadow-lg",
                message.trim() && !isBusy
                  ? "bg-blue-500 hover:bg-blue-600 hover:scale-105 shadow-blue-500/25"
                  : "bg-gray-600 hover:bg-gray-500"
              )}
              aria-label="Send message"
            >
              <ArrowUp className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-2.5 text-xs text-center text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
        Press{" "}
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 align-middle">
          Enter
        </kbd>{" "}
        to send,{" "}
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 align-middle">
          Shift + Enter
        </kbd>{" "}
        for new line
      </div>
    </div>
  );
}
