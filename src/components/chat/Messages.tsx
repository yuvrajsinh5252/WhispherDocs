import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { useEffect, useRef, useMemo } from "react";
import { useIntersection } from "@mantine/hooks";
import { useChatStore } from "@/stores/chatStore";
import { UIMessage } from "@ai-sdk/react";
import { ChatStatus } from "ai";
import LoadingSkeleton, { LoadingDots } from "./interface/LoadingSkeleton";
import { combineNormalizedMessages } from "@/lib/message-normalizer";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import EmptyState from "./interface/EmptyState";

export default function Messages({
  status,
  uiMessages,
}: {
  status: ChatStatus;
  uiMessages: UIMessage[];
}) {
  const { fileId } = useChatStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.getMessages.useInfiniteQuery(
      {
        fileId: fileId ?? "",
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
      }
    );

  const messages = useMemo(() => {
    const dbMessages = data?.pages
      .flatMap((page) => page.messages || [])
      .reverse();
    return combineNormalizedMessages(dbMessages || [], uiMessages);
  }, [uiMessages, data?.pages]);

  const { ref: intersectionRef, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col h-full relative" ref={containerRef}>
      {isFetchingNextPage && (
        <div className="absolute top-5 left-1/2 z-10 flex items-center justify-center">
          <LoadingDots />
        </div>
      )}

      {messages && messages.length > 0 ? (
        <Conversation className="h-full mb-20 pb-6">
          <ConversationContent>
            {messages.map((message, index) => (
              <div key={message.id}>
                {hasNextPage &&
                  index === messages.length - messages.length * 0.6 && (
                    <div ref={intersectionRef} className="h-1 w-full" />
                  )}

                {message.role === "assistant" && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === "source-url"
                        ).length
                      }
                    />
                    {message.parts
                      .filter((part) => part.type === "source-url")
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="w-full"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
