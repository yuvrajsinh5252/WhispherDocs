import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERRY_LIMIT } from "@/config/infiinte-querry";
import { Loader2, MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { useIntersection } from "@mantine/hooks";

interface MessageProps {
  fileId: string;
}

export default function Messages({ fileId }: MessageProps) {
  const { isLoading: isAithinking } = useContext(ChatContext);
  const theme = localStorage.getItem("theme") ?? "light";

  const { data, isLoading, fetchNextPage } = trpc.getMessages.useInfiniteQuery(
    {
      fileId,
      limit: INFINITE_QUERRY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    }
  );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <div
            className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>
        <span className="text-xs text-gray-500">AI is thinking</span>
      </div>
    ),
  };

  const CombinedMessage = [
    ...(isAithinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
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
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                    <Skeleton className="h-6 w-6" />
                  </div>
                )}
                <div
                  className={`flex flex-col gap-2 ${
                    i % 2 === 0 ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-md ${
                      i % 2 === 0
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-blue-100 dark:bg-blue-900/20"
                    }`}
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  {i % 2 === 1 && (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  )}
                </div>
                {i % 2 === 1 && (
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/20">
                    <Skeleton className="h-6 w-6" />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col-reverse relative overflow-y-auto scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-w-2 scroll-smooth">
      {CombinedMessage && CombinedMessage.length > 0 ? (
        <div className="flex flex-col-reverse gap-3 px-3 pb-3">
          {CombinedMessage.map((message, i) => {
            const isNextMessageSamePerson =
              CombinedMessage[i - 1]?.isUserMessage ===
              CombinedMessage[i]?.isUserMessage;

            if (i === CombinedMessage.length - 1)
              return (
                <Message
                  ref={ref}
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  key={message.id}
                />
              );
            else
              return (
                <Message
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  key={message.id}
                />
              );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
            <MessagesSquare className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="font-medium text-lg">Start the conversation</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Ask questions about your document to get instant, accurate answers
          </p>
        </div>
      )}
    </div>
  );
}
