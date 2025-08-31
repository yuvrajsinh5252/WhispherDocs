import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { Message } from "./Message";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useChatStore } from "@/stores/chatStore";
import { LoadingDots } from "./Thinking";
import { UIMessage } from "@ai-sdk/react";
import { ChatStatus } from "ai";
import { loadingMessage } from "./interface/LoadingMessage";
import LoadingSkeleton from "./interface/LoadingSkeleton";
import EmptyState from "./interface/EmptyState";
import { ExtendedMessages } from "@/types/messages";

export default function Messages({
  status,
  uiMessages,
}: {
  status: ChatStatus;
  uiMessages: UIMessage[];
}) {
  const { selectedModel, fileId } = useChatStore();
  const isAiThinking = status === "submitted" || status === "streaming";
  const scrollToBottom = useRef(true);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const firstMessageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number | null>(null);

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

  let messages = data?.pages.flatMap((page) => page.messages).reverse();

  // Get the last UI message
  const lastUIMessage = uiMessages[uiMessages.length - 1];

  // Check if we have a valid last UI message
  if (lastUIMessage) {
    // Check if this message ID already exists in the messages array
    const existingMessageIndex = messages?.findIndex(
      (message) => message.id === lastUIMessage.id
    );

    if (
      existingMessageIndex !== undefined &&
      existingMessageIndex !== -1 &&
      messages
    ) {
      // Update existing message
      const existingMessage = messages[existingMessageIndex];
      messages[existingMessageIndex] = {
        ...existingMessage,
        text:
          lastUIMessage.parts.find((part) => part.type === "text")?.text ??
          existingMessage.text,
        // Update other fields as needed based on UIMessage type
        hasThinking: false,
        isUserMessage: lastUIMessage.role === "user",
      };
    } else {
      // Add new message
      const newMessage = {
        id: lastUIMessage.id,
        createdAt: new Date().toISOString(),
        text:
          lastUIMessage.parts.find((part) => part.type === "text")?.text ?? "",
        hasThinking: false,
        isUserMessage: lastUIMessage.role === "user",
      };
      messages = messages ? [...messages, newMessage] : [newMessage];
    }
  }

  const allMessages: ExtendedMessages[] = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!messages || !scrollToBottom.current) return;
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      scrollToBottom.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      if (containerRef.current) {
        const scrollHeight = containerRef.current.scrollHeight;
        const scrollTop = containerRef.current.scrollTop;
        setScrollPosition(scrollHeight - scrollTop);
      }
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (isFetchingNextPage || !containerRef.current || scrollPosition === null)
      return;
    const newScrollHeight = containerRef.current.scrollHeight;
    containerRef.current.scrollTop = newScrollHeight - scrollPosition;
    setScrollPosition(null);
  }, [isFetchingNextPage, messages]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col relative px-3 sm:px-4 gap-1 sm:gap-2 overflow-y-auto pb-[200px] pt-5 custom-scrollbar"
    >
      <div ref={ref} className="h-10" />
      {allMessages && allMessages.length > 0 ? (
        <>
          {allMessages.map((message, i) => {
            const isNextMessageSamePerson =
              allMessages[i - 1]?.isUserMessage ===
              allMessages[i]?.isUserMessage;

            return (
              <Message
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                status={status}
                selectedModel={selectedModel}
                key={message.id}
                ref={(el) => {
                  if (i === 0) {
                    firstMessageRef.current = el;
                  }
                  if (i === allMessages.length - 1) {
                    lastMessageRef.current = el;
                  }
                }}
                data-message-id={message.id}
              />
            );
          })}

          {isFetchingNextPage && (
            <div className="absolute left-1/2 top-10">
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
