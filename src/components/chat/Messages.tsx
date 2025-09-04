import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";
import { useEffect, useRef, useMemo, Fragment } from "react";
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
import { Actions, Action } from "@/components/ai-elements/actions";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { CopyIcon } from "lucide-react";
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
            {messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {hasNextPage &&
                  messageIndex === messages.length - messages.length * 0.6 && (
                    <div ref={intersectionRef} className="h-1 w-full" />
                  )}

                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      const isLastMessage =
                        messageIndex === messages.length - 1;

                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" && isLastMessage && (
                            <Actions>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </Fragment>
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
              </Fragment>
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
