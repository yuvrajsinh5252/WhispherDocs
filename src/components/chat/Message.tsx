import { cn } from "@/lib/utils";
import { ExtendedMessages } from "@/types/messages";
import { Bot, UserRound, Brain, ChevronDown, ChevronRight } from "lucide-react";
import { forwardRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { trpc } from "@/app/_trpc/client";

interface MessageProps {
  message: ExtendedMessages;
  isNextMessageSamePerson: boolean;
  selectedModel?: string;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
    const [fetchedThinking, setFetchedThinking] = useState<string | null>(null);
    const [messageToFetch, setMessageToFetch] = useState<string | null>(null);

    const isCompletedMessage =
      message.id !== "ai-response" && !message.isUserMessage;
    const isStreamingMessage =
      message.id === "ai-response" && !message.isUserMessage;
    const hasThinkingContent = message.thinking || fetchedThinking;
    const shouldAutoExpandThinking = isStreamingMessage && message.thinking;

    const { data: thinkingData, isLoading: isFetchingThinking } =
      trpc.getMessageThinking.useQuery(
        { messageId: messageToFetch! },
        { enabled: !!messageToFetch }
      );

    useEffect(() => {
      if (thinkingData && messageToFetch) {
        setFetchedThinking(thinkingData.thinking || null);
        setMessageToFetch(null);
        if (thinkingData.thinking) {
          setIsThinkingExpanded(true);
        }
      }
    }, [thinkingData, messageToFetch]);

    const handleToggleThinking = () => {
      if (shouldAutoExpandThinking) return;

      if (!isThinkingExpanded && !fetchedThinking && isCompletedMessage) {
        setMessageToFetch(message.id);
      }
      setIsThinkingExpanded(!isThinkingExpanded);
    };

    const shouldShowThinkingToggle =
      (isStreamingMessage && hasThinkingContent) ||
      (isCompletedMessage && (message.hasThinking || hasThinkingContent));

    const shouldShowThinking =
      shouldAutoExpandThinking || (isThinkingExpanded && hasThinkingContent);

    const ThinkingContent = ({
      content,
      isStreaming,
    }: {
      content: string;
      isStreaming?: boolean;
    }) => (
      <div className="mb-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-md p-2 border border-gray-200/30 dark:border-gray-700/30">
          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
            {content}
            {isStreaming && (
              <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-gray-500 animate-pulse"></span>
            )}
          </div>
        </div>
      </div>
    );

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
            "sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 transition-all hover:shadow-lg",
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
          {/* Show toggle button for completed messages with thinking - at the top */}
          {!message.isUserMessage &&
            shouldShowThinkingToggle &&
            !shouldAutoExpandThinking && (
              <button
                onClick={handleToggleThinking}
                className="flex items-center gap-1.5 mb-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                disabled={isFetchingThinking}
              >
                {isThinkingExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Brain className="h-3 w-3" />
                <span>{isFetchingThinking ? "Loading..." : "Reasoning"}</span>
              </button>
            )}

          {/* Show reasoning content when expanded - below the toggle button */}
          {shouldShowThinking && (
            <ThinkingContent
              content={message.thinking || fetchedThinking || ""}
              isStreaming={!!shouldAutoExpandThinking}
            />
          )}

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
              className={cn("flex-shrink-0 mr-2 sm:hidden", {
                hidden: message.isUserMessage,
              })}
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
