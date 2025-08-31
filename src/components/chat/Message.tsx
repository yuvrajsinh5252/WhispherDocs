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
      {!message.isUserMessage && (
        <div className="flex-shrink-0 mr-2 max-sm:hidden">
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      )}

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
              ? "text-indigo-100"
              : "text-indigo-600/70 dark:text-gray-300/70"
          )}
        >
          <div
            className={cn("flex-shrink-0 mr-1 sm:hidden", {
              hidden: message.isUserMessage,
            })}
          >
            <div className="h-3 w-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <Bot className="h-2 w-2 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
          {format(new Date(message.createdAt), "h:mm a")}
        </div>
      </div>

      {message.isUserMessage && (
        <div className="flex-shrink-0 ml-1.5">
          <div className="h-5 w-5 sm:h-7 sm:w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-700/50">
            <UserRound className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      )}
    </div>
  );
});

Message.displayName = "Message";
