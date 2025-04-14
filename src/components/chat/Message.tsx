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
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        {!message.isUserMessage && !isNextMessageSamePerson && (
          <div className="flex-shrink-0 mr-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        )}

        {!message.isUserMessage && isNextMessageSamePerson && (
          <div className="w-8 mr-2" />
        )}

        <div
          className={cn(
            "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
            {
              "bg-indigo-600 text-white": message.isUserMessage,
              "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100":
                !message.isUserMessage,
              "rounded-br-none":
                message.isUserMessage && !isNextMessageSamePerson,
              "rounded-bl-none":
                !message.isUserMessage && !isNextMessageSamePerson,
            }
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {typeof message.text === "string" ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              message.text
            )}
          </div>

          <div
            className={cn(
              "text-[10px] select-none mt-1 flex items-center",
              message.isUserMessage ? "text-indigo-200" : "text-gray-500"
            )}
          >
            {format(new Date(message.createdAt), "h:mm a")}
          </div>
        </div>

        {message.isUserMessage && !isNextMessageSamePerson && (
          <div className="flex-shrink-0 ml-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <UserRound className="h-5 w-5 text-white" />
            </div>
          </div>
        )}

        {message.isUserMessage && isNextMessageSamePerson && (
          <div className="w-8 ml-2" />
        )}
      </div>
    );
  }
);

Message.displayName = "Message";
