import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { useEffect, useRef, useMemo } from "react";
import { useIntersection } from "@mantine/hooks";
import { useChatStore } from "@/stores/chatStore";
import { UIMessage } from "@ai-sdk/react";
import { ChatStatus } from "ai";
import LoadingSkeleton from "./interface/LoadingSkeleton";
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
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingSkeleton />;

  const totalPages = data?.pages?.length || 0;
  const totalMessages = messages.length;
  const hasMoreMessages = hasNextPage;

  return (
    <div className="flex flex-col h-full relative">
      {/* Pagination Loading Indicator */}
      {isFetchingNextPage && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader />
            <span>Loading older messages...</span>
          </div>
        </div>
      )}

      {/* Message Count Indicator */}
      {totalPages > 1 && (
        <div className="absolute top-0 right-0 z-10 bg-background/90 backdrop-blur-sm rounded-bl-lg px-3 py-1 text-xs text-muted-foreground border-l border-b">
          {totalMessages} messages • {totalPages} pages
          {hasMoreMessages && " • More available"}
        </div>
      )}

      <Conversation className="h-full mb-20 pb-6">
        <ConversationContent>
          {/* Load More Trigger - Place at the top */}
          {hasMoreMessages && (
            <div ref={intersectionRef} className="h-1 w-full" />
          )}

          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" && (
                <Sources>
                  <SourcesTrigger
                    count={
                      message.parts.filter((part) => part.type === "source-url")
                        .length
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
    </div>
  );
}
