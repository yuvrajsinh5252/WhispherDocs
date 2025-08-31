import { cn } from "@/lib/utils";
import { ExtendedMessages } from "@/types/messages";
import { Bot, UserRound } from "lucide-react";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

export const Message = forwardRef<
  HTMLDivElement,
  { message: ExtendedMessages }
>(({ message }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-end my-0.5 sm:my-1 transition-all", {
        "justify-end": message.isUserMessage,
      })}
      data-message-id={message.id}
    >
      <div
        className={cn("rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2.5", {
          "max-w-[85%] sm:max-w-[70%] bg-indigo-500 text-white border border-indigo-400/30 shadow-sm":
            message.isUserMessage,
          "max-w-[90%] sm:max-w-[80%] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm":
            !message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "prose prose-xs dark:prose-invert max-w-none leading-relaxed break-words text-xs sm:text-sm",
            !message.isUserMessage &&
              "prose-a:text-indigo-600 dark:prose-a:text-indigo-300 prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-strong:text-indigo-700 dark:prose-strong:text-indigo-200 prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-p:my-1",
            message.isUserMessage &&
              "prose-headings:text-white text-white prose-a:text-blue-100 prose-strong:text-indigo-100 prose-p:text-white prose-p:my-1"
          )}
        >
          {typeof message.text === "string" ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            message.text
          )}
        </div>

        <div
          className={cn(
            "text-[10px] select-none mt-1 flex items-center font-light gap-1",
            message.isUserMessage
              ? "text-indigo-100 justify-end"
              : "text-indigo-600/70 dark:text-gray-300/70"
          )}
        >
          {!message.isUserMessage && (
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center border border-gray-300 dark:border-gray-600 shadow-sm">
              <Bot className="h-2.5 w-2.5 text-gray-700 dark:text-gray-200" />
            </div>
          )}
          {format(new Date(message.createdAt), "h:mm a")}
          {message.isUserMessage && (
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center border border-indigo-300 dark:border-indigo-600/50 shadow-sm">
              <UserRound className="h-2.5 w-2.5 text-indigo-700 dark:text-indigo-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Message.displayName = "Message";
