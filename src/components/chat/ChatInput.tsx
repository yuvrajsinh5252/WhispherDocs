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
    <div className="relative w-full p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white dark:bg-gray-800">
        <Textarea
          placeholder="Ask a question about your document..."
          autoFocus
          rows={1}
          maxRows={5}
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
            "min-h-[60px] w-full resize-none border-0 bg-transparent py-3.5 pl-4 pr-14 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm dark:placeholder-gray-400",
            isLoading && "text-gray-400"
          )}
        />

        <div className="absolute right-2 bottom-2">
          <Button
            size="sm"
            type="submit"
            disabled={isLoading || isDisabled || !message.trim()}
            onClick={handleSendMessage}
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-colors",
              message.trim()
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300 dark:bg-gray-700"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="h-4 w-4 text-white" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>

      <div className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
