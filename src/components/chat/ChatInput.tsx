import { ArrowUp, Loader2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  isDisabled: boolean;
}

export default function ChatInput({ isDisabled }: ChatInputProps) {
  const { addMessage, message, handleInputChange, isLoading } =
    useContext(ChatContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading && !isDisabled) {
      addMessage();
      textAreaRef.current?.focus();
    }
  };

  return (
    <div className="relative w-full bg-white dark:bg-gray-900">
      <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-white dark:bg-gray-800 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600">
        <Textarea
          placeholder="Ask a question about your document..."
          autoFocus
          rows={1}
          maxRows={4}
          ref={textAreaRef}
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
            "min-h-[44px] sm:min-h-[52px] w-full resize-none border-0 bg-transparent py-3 sm:py-4 pl-4 sm:pl-5 pr-12 sm:pr-14 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-[15px] leading-relaxed text-gray-900 dark:text-gray-100 dark:placeholder-gray-400 placeholder-gray-500 transition-colors duration-200",
            isLoading && "text-gray-400 dark:text-gray-500",
            !isDisabled &&
              "hover:placeholder-gray-600 dark:hover:placeholder-gray-300"
          )}
        />

        <div className="absolute right-3 bottom-3">
          <Button
            size="sm"
            type="submit"
            disabled={isLoading || isDisabled || !message.trim()}
            onClick={handleSendMessage}
            className={cn(
              "h-9 w-9 p-0 rounded-full transition-all duration-300 shadow-lg",
              message.trim()
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:scale-105 hover:shadow-indigo-500/30 transform"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="h-4 w-4 text-white transition-transform group-hover:translate-y-[-1px]" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>

      <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
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
