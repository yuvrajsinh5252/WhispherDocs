import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { Message } from "./Message";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useChatStore } from "@/stores/chatStore";
import { LoadingDots } from "./Thinking";
import { UIMessage } from "@ai-sdk/react";
import { ChatStatus } from "ai";
import { loadingMessage } from "./interface/LoadingMessage";
import LoadingSkeleton from "./interface/LoadingSkeleton";
import EmptyState from "./interface/EmptyState";
import { ExtendedMessages } from "@/types/messages";

const processUIMessages = (
  uiMessages: UIMessage[],
  existingMessages: any[] | undefined
): any[] => {
  if (uiMessages.length === 0) {
    return existingMessages ?? [];
  }

  const existingMessagesMap = new Map(
    existingMessages?.map((msg) => [msg.id, msg]) ?? []
  );

  uiMessages.forEach((uiMessage) => {
    const messageText =
      uiMessage.parts.find((part) => part.type === "text")?.text ?? "";

    if (existingMessagesMap.has(uiMessage.id)) {
      const existingMessage = existingMessagesMap.get(uiMessage.id)!;
      existingMessagesMap.set(uiMessage.id, {
        ...existingMessage,
        text: messageText,
        hasThinking: false,
        isUserMessage: uiMessage.role === "user",
      });
    } else {
      const newMessage = {
        id: uiMessage.id,
        createdAt: new Date().toISOString(),
        text: messageText,
        hasThinking: false,
        isUserMessage: uiMessage.role === "user",
      };
      existingMessagesMap.set(uiMessage.id, newMessage);
    }
  });

  return Array.from(existingMessagesMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export default function Messages({
  status,
  uiMessages,
}: {
  status: ChatStatus;
  uiMessages: UIMessage[];
}) {
  const { fileId } = useChatStore();
  const isAiThinking = status === "submitted" || status === "streaming";
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitial = useRef(true);

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

  const databaseMessages = data?.pages
    .flatMap((page) => page.messages)
    .reverse();
  const messages = processUIMessages(uiMessages, databaseMessages);

  const allMessages: ExtendedMessages[] = [
    ...(messages ?? []),
    ...(isAiThinking ? [loadingMessage] : []),
  ];

  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });

  // Consolidated scroll logic
  useEffect(() => {
    if (!containerRef.current || !lastMessageRef.current) return;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const bottomDist = scrollHeight - scrollTop - clientHeight;
    const lastMessage = allMessages[allMessages.length - 1];

    // Scroll to bottom conditions
    const shouldScrollToBottom =
      isInitial.current ||
      bottomDist <= 100 ||
      isAiThinking ||
      (lastMessage && lastMessage.isUserMessage);

    if (shouldScrollToBottom) {
      if (isInitial.current) {
        container.scrollTop = container.scrollHeight;
        isInitial.current = false;
      } else {
        // Small delay for smooth scrolling on new messages
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 50);
      }
    }
  }, [allMessages, status, isAiThinking]);

  // Handle infinite scroll
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col relative px-3 sm:px-4 gap-1 sm:gap-2 overflow-y-auto pb-20 mb-10 pt-5 custom-scrollbar"
    >
      <div ref={ref} className="h-10" />
      {allMessages && allMessages.length > 0 ? (
        <>
          {allMessages.map((message, i) => (
            <Message
              message={message}
              key={message.id}
              ref={(el) => {
                if (i === allMessages.length - 1) {
                  lastMessageRef.current = el;
                }
              }}
              data-message-id={message.id}
            />
          ))}

          {isFetchingNextPage && (
            <div className="absolute left-1/2 top-20">
              <LoadingDots />
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
