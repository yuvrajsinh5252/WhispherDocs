import { cn } from "@/lib/utils";
import { ExtendedMessages } from "@/types/messages";
import { Bot, UserRound } from "lucide-react";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

interface MessageProps {
  message: ExtendedMessages;
  isNextMessageSamePerson: boolean;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end my-1.5 sm:my-2 transition-all", {
          "justify-end": message.isUserMessage,
        })}
        data-message
      >
        {!message.isUserMessage && !isNextMessageSamePerson && (
          <div className="flex-shrink-0 mr-2 max-sm:hidden">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-indigo-800/50 dark:to-indigo-600/30 flex items-center justify-center shadow-md border border-indigo-200/50 dark:border-indigo-600/30">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-200" />
            </div>
          </div>
        )}

        {!message.isUserMessage && isNextMessageSamePerson && (
          <div className="w-8 sm:w-9 mr-2" />
        )}

        <div
          className={cn(
            " sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 transition-all hover:shadow-lg",
            {
              "bg-gradient-to-br from-indigo-500/90 to-violet-600/90 text-white backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-md hover:shadow-indigo-500/20 dark:hover:shadow-indigo-400/10":
                message.isUserMessage,
              "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/90 dark:to-gray-700/80 text-gray-100 backdrop-blur-sm shadow-md border border-indigo-100 dark:border-gray-600/50 hover:border-indigo-200 dark:hover:border-gray-500/50":
                !message.isUserMessage,
              "rounded-br-none":
                message.isUserMessage && !isNextMessageSamePerson,
              "rounded-bl-none":
                !message.isUserMessage && !isNextMessageSamePerson,
            }
          )}
        >
          <div
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              !message.isUserMessage &&
                "prose-a:text-indigo-600 dark:prose-a:text-indigo-300 prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-strong:text-indigo-700 dark:prose-strong:text-indigo-200",
              message.isUserMessage &&
                "prose-headings:text-white text-white prose-a:text-blue-100 prose-strong:text-indigo-100"
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
              "text-xs select-none mt-1 flex items-center font-light gap-1",
              message.isUserMessage
                ? "text-indigo-100"
                : "text-indigo-600/70 dark:text-gray-300/70"
            )}
          >
            <div
              className={
                "flex-shrink-0 mr-2 sm:hidden " +
                (message.isUserMessage ? "hidden" : "")
              }
            >
              <div className="h-4 w-4 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-indigo-800/50 dark:to-indigo-600/30 flex items-center justify-center shadow-md border border-indigo-200/50 dark:border-indigo-600/30">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-200" />
              </div>
            </div>
            {format(new Date(message.createdAt), "h:mm a")}
          </div>
        </div>

        {message.isUserMessage && !isNextMessageSamePerson && (
          <div className="flex-shrink-0 ml-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md ring-2 ring-indigo-400/40 dark:ring-indigo-300/30">
              <UserRound className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
        )}

        {message.isUserMessage && isNextMessageSamePerson && (
          <div className="w-8 sm:w-9 ml-2" />
        )}
      </div>
    );
  }
);

Message.displayName = "Message";
