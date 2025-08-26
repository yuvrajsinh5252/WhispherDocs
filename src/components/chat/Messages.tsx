import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "./Message";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useChatStore } from "@/stores/chatStore";
import { ChatMessage } from "@/stores/chatStore";
import { ModelId } from "@/lib/chat-api/constants";

const LoadingDots = ({
  className = "bg-indigo-400",
}: {
  className?: string;
}) => (
  <div className="flex space-x-1.5 py-0.5">
    <div
      className={`h-2.5 w-2.5 ${className} rounded-full animate-bounce shadow-sm`}
      style={{ animationDelay: "0ms" }}
    />
    <div
      className={`h-2.5 w-2.5 ${className} rounded-full animate-bounce shadow-sm`}
      style={{ animationDelay: "200ms" }}
    />
    <div
      className={`h-2.5 w-2.5 ${className} rounded-full animate-bounce shadow-sm`}
      style={{ animationDelay: "400ms" }}
    />
  </div>
);

interface MessagesProps {
  messages?: ChatMessage[];
  isLoading?: boolean;
  selectedModel?: ModelId;
}

export default function Messages({
  messages: propMessages,
  isLoading: propIsLoading,
  selectedModel: propSelectedModel,
}: MessagesProps = {}) {
  const {
    isLoading: isAiThinking,
    selectedModel: storeSelectedModel,
    messages: localMessages,
    fileId,
  } = useChatStore();

  // Use props if provided, otherwise fall back to store values
  const isLoading = propIsLoading ?? isAiThinking;
  const selectedModel = propSelectedModel ?? storeSelectedModel;
  const messages = propMessages ?? localMessages;

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  const loadingMoreRef = useRef<boolean>(false);

  const {
    data,
    isLoading: isServerLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.getMessages.useInfiniteQuery(
    {
      fileId: fileId!,
      limit: INFINITE_QUERY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchOnWindowFocus: false,
      enabled: !!fileId,
    }
  );

  const serverMessages = data?.pages.flatMap((page) => page.messages);

  // Merge server messages with local messages, avoiding duplicates
  const allMessages = [
    ...(serverMessages ?? []),
    ...messages.filter(
      (localMsg: any) =>
        !serverMessages?.some((serverMsg: any) => serverMsg.id === localMsg.id)
    ),
  ];

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    hasThinking: false,
    text: (
      <div className="flex items-center justify-start space-x-3">
        <LoadingDots />
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
          Processing...
        </span>
      </div>
    ),
  };

  const finalMessages = [
    ...(isLoading ? [loadingMessage] : []),
    ...(allMessages ?? []),
  ];

  const scrollRef = useRef<{
    endElementRef: HTMLDivElement | null;
    lastMessageId: string | null;
    isFirstRender: boolean;
  }>({
    endElementRef: null,
    lastMessageId: null,
    isFirstRender: true,
  });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    const currentLatestMessageId = allMessages?.[0]?.id;

    // Case: First meaningful render with messages - scroll to bottom
    if (allMessages?.length && scrollRef.current.isFirstRender) {
      scrollRef.current.endElementRef?.scrollIntoView({ behavior: "auto" });
      scrollRef.current.isFirstRender = false;
      scrollRef.current.lastMessageId = currentLatestMessageId ?? null;
      return;
    }

    // Case: New message received - scroll to bottom
    if (currentLatestMessageId !== scrollRef.current.lastMessageId) {
      setTimeout(() => {
        scrollRef.current.endElementRef?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      scrollRef.current.lastMessageId = currentLatestMessageId ?? null;
    }
  }, [allMessages]);

  useEffect(() => {
    if (!allMessages) return;

    const messagesLength = allMessages.length;
    const container = messagesContainerRef.current;

    if (
      loadingMoreRef.current &&
      messagesLength > prevMessagesLengthRef.current &&
      container
    ) {
      const newMessagesCount = messagesLength - prevMessagesLengthRef.current;

      if (newMessagesCount > 0) {
        const messageElements = container.querySelectorAll("[data-message]");
        if (messageElements.length > 0) {
          const newMessageElement =
            messageElements[messageElements.length - newMessagesCount];
          if (newMessageElement) {
            newMessageElement.scrollIntoView({
              block: "start",
              behavior: "auto",
            });
          }
        }
      }

      loadingMoreRef.current = false;
    }

    prevMessagesLengthRef.current = messagesLength;
  }, [allMessages]);

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      // Set loading flag before fetching next page
      loadingMoreRef.current = true;
      prevMessagesLengthRef.current = allMessages?.length || 0;
      fetchNextPage();
    }
  }, [
    entry,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    allMessages?.length,
  ]);

  if (isServerLoading && !serverMessages) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 animate-in fade-in duration-500">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 ${
                i % 2 === 0 ? "" : "justify-end"
              }`}
            >
              <div
                className={`flex gap-3 ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {i % 2 === 0 && (
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-indigo-700/20 shadow-sm border border-indigo-200/50 dark:border-indigo-700/30">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                )}
                <div
                  className={`flex flex-col gap-2 ${
                    i % 2 === 0 ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 max-w-md backdrop-blur-sm shadow-md ${
                      i % 2 === 0
                        ? "bg-white/90 dark:bg-gray-800/70 border border-gray-100/50 dark:border-gray-700/50"
                        : "bg-gradient-to-br from-indigo-500/90 to-violet-600/90 border border-white/10"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <Skeleton
                        className={`h-4 w-[250px] ${
                          i % 2 === 1 ? "bg-white/30" : ""
                        }`}
                      />
                      <Skeleton
                        className={`h-4 w-[200px] ${
                          i % 2 === 1 ? "bg-white/30" : ""
                        }`}
                      />
                      <Skeleton
                        className={`h-4 w-[150px] ${
                          i % 2 === 1 ? "bg-white/30" : ""
                        }`}
                      />
                    </div>
                  </div>
                  {i % 2 === 1 && (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16 bg-indigo-200/40 dark:bg-indigo-700/40" />
                    </div>
                  )}
                </div>
                {i % 2 === 1 && (
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md ring-2 ring-indigo-400/30 dark:ring-indigo-300/20">
                    <Skeleton className="h-6 w-6 rounded-full bg-white/30" />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="h-full flex flex-col-reverse overflow-y-auto px-2 sm:px-3 gap-0.5 sm:gap-1 scroll-smooth scrollbar-none hover:scrollbar-thin hover:scrollbar-thumb-gray-200 dark:hover:scrollbar-thumb-gray-700 hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600 hover:scrollbar-thumb-rounded-full"
    >
      {finalMessages && finalMessages.length > 0 ? (
        <>
          <div
            ref={(el) => {
              scrollRef.current.endElementRef = el;
            }}
            className="h-1"
          />

          {finalMessages.map((message, i) => {
            const isNextMessageSamePerson =
              finalMessages[i - 1]?.isUserMessage ===
              finalMessages[i]?.isUserMessage;

            return (
              <Message
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                selectedModel={selectedModel}
                key={message.id}
                data-message
              />
            );
          })}

          {isFetchingNextPage && (
            <div className="flex justify-center py-3 animate-in fade-in duration-300">
              <div className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <LoadingDots className="bg-indigo-500 dark:bg-indigo-400" />
              </div>
            </div>
          )}

          <div ref={ref} className="h-5 w-full opacity-0" aria-hidden="true" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-indigo-700/30 flex items-center justify-center mb-5 shadow-md border border-indigo-200/50 dark:border-indigo-700/30 ring-8 ring-indigo-50/20 dark:ring-indigo-900/10">
            <MessagesSquare className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
            Start the conversation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm leading-relaxed">
            Ask questions about your document to get instant, accurate answers
          </p>
        </div>
      )}
    </div>
  );
}
