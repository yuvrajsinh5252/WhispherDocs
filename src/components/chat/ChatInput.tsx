import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/hooks/useScreenSize";

interface ChatInputProps {
  isDisabled: boolean;
}

export default function ChatInput({ isDisabled }: ChatInputProps) {
  const { addMessage, message, handleInputChange, isLoading } =
    useContext(ChatContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useScreenSize();

  const handleSendMessage = () => {
    if (message.trim() && !isLoading && !isDisabled) {
      addMessage();
      textAreaRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isMobile && textAreaRef.current && !isDisabled) {
      textAreaRef.current.focus();
    }
  }, [isMobile, isDisabled]);

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
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <Textarea
          placeholder={
            isMobile
              ? "Ask a question..."
              : "Ask a question about your document..."
          }
          ref={textAreaRef}
          rows={1}
          maxRows={isMobile ? 4 : 6}
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading || isDisabled}
          className={cn(
            "min-h-[44px] sm:min-h-[52px] w-full resize-none border-0 bg-transparent py-3 sm:py-4 pl-4 sm:pl-5 pr-12 sm:pr-14 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-[15px] leading-relaxed text-gray-900 dark:text-gray-100 dark:placeholder-gray-400 placeholder-gray-500 transition-colors duration-200 backdrop-blur-xl no-scrollbar rounded-xl overflow-hidden",
            isLoading && "text-gray-400 dark:text-gray-500",
            !isDisabled &&
              "hover:placeholder-gray-600 dark:hover:placeholder-gray-300"
          )}
        />

        <div className="absolute right-3 bottom-[calc(50%-20px)]">
          <Button
            size="sm"
            type="submit"
            disabled={isLoading || isDisabled || !message.trim()}
            onClick={handleSendMessage}
            className={cn(
              "h-10 w-10 p-0 rounded-full transition-all duration-300 shadow-lg",
              message.trim()
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:scale-105 hover:shadow-indigo-500/30 transform"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <ArrowUp className="h-5 w-5 text-white transition-transform group-hover:translate-y-[-1px]" />
            )}
          </Button>
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
