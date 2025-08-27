import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "./Message";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useChatStore } from "@/stores/chatStore";
import { LoadingDots } from "./Thinking";
import { UIMessage } from "@ai-sdk/react";
import { ChatStatus } from "ai";

export default function Messages({
  status,
  uiMessages,
}: {
  status: ChatStatus;
  uiMessages: UIMessage[];
}) {
  const { selectedModel, fileId } = useChatStore();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  const loadingMoreRef = useRef<boolean>(false);

  console.log(uiMessages);

  const isAiThinking = status === "submitted" || status === "streaming";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.getMessages.useInfiniteQuery(
      {
        fileId: fileId ?? "",
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchOnWindowFocus: false,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

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

  const allMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
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
    const currentLatestMessageId = messages?.[0]?.id;

    // Case: First meaningful render with messages - scroll to bottom
    if (messages?.length && scrollRef.current.isFirstRender) {
      scrollRef.current.endElementRef?.scrollIntoView({ behavior: "auto" });
      scrollRef.current.isFirstRender = false;
      scrollRef.current.lastMessageId = currentLatestMessageId ?? null;
      return;
    }

    // Case: New message received and AI is thinking
    if (
      currentLatestMessageId !== scrollRef.current.lastMessageId &&
      isAiThinking
    ) {
      scrollRef.current.endElementRef?.scrollIntoView({ behavior: "smooth" });
      scrollRef.current.lastMessageId = currentLatestMessageId ?? null;
    }
  }, [messages, isAiThinking]);

  useEffect(() => {
    if (!messages) return;

    const messagesLength = messages.length;
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
  }, [messages]);

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      // Set loading flag before fetching next page
      loadingMoreRef.current = true;
      prevMessagesLengthRef.current = messages?.length || 0;
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage, messages?.length]);

  if (isLoading) {
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
      className="flex-1 flex flex-col-reverse relative px-3 sm:px-4 gap-1 sm:gap-2 scroll-smooth scrolling-touch overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
      }}
    >
      {allMessages && allMessages.length > 0 ? (
        <>
          <div
            ref={(el) => {
              scrollRef.current.endElementRef = el;
            }}
            className="h-1"
          />

          {allMessages.map((message, i) => {
            const isNextMessageSamePerson =
              allMessages[i - 1]?.isUserMessage ===
              allMessages[i]?.isUserMessage;

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
          <h3 className="font-medium text-base text-gray-900 dark:text-gray-100">
            Start conversation
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 max-w-sm leading-relaxed">
            Ask questions about your document
          </p>
        </div>
      )}
    </div>
  );
}
