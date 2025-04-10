import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERRY_LIMIT } from "@/config/infiinte-querry";
import { Loader2, MessagesSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
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
      ) : isLoading ? (
        <div className="flex flex-col gap-2 p-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {i % 2 === 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
              )}
              <div
                className={`rounded-2xl px-3 py-2 ${
                  i % 2 === 0
                    ? "rounded-tl-none bg-gray-200 dark:bg-gray-700"
                    : "rounded-tr-none bg-indigo-100 dark:bg-indigo-900"
                }`}
              >
                <Skeleton
                  count={1}
                  width={i % 2 === 0 ? 180 : 120}
                  height={14}
                />
                {i % 2 === 0 && (
                  <Skeleton
                    count={1}
                    width={140}
                    height={14}
                    className="mt-1"
                  />
                )}
              </div>
              {i % 2 !== 0 && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 shrink-0"></div>
              )}
            </div>
          ))}
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
