"use client";

import { createContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERRY_LIMIT } from "@/config/infiinte-querry";
import { toast } from "../ui/use-toast";

type streamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<streamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export default function ChatContextProvider({ fileId, children }: Props) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useUtils();
  const backUpMessages = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch(`/api/message`, {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },

    onMutate: async ({ message }) => {
      backUpMessages.current = message;
      setMessage("");

      await utils.getMessages.cancel();
      const previousMessages = utils.getMessages.getInfiniteData();

      utils.getMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERRY_LIMIT },
        (old) => {
          if (!old)
            return {
              pages: [],
              pageParams: [],
            };
          let newPages = [...old.pages];

          let latestPage = newPages[0]!;
          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );
      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accResponse = "";

      let streamTimeout: NodeJS.Timeout | null = null;
      let chunkTimeout: NodeJS.Timeout | null = null;

      const clearStreamTimeout = () => {
        if (streamTimeout) {
          clearTimeout(streamTimeout);
          streamTimeout = null;
        }
      };

      const clearChunkTimeout = () => {
        if (chunkTimeout) {
          clearTimeout(chunkTimeout);
          chunkTimeout = null;
        }
      };

      try {
        streamTimeout = setTimeout(() => {
          if (!done) {
            done = true;
            reader.cancel("Stream timeout exceeded").catch(console.error);

            if (accResponse) {
              accResponse +=
                "\n\n*Note: Response was incomplete due to timeout.*";

              utils.getMessages.setInfiniteData(
                { fileId, limit: INFINITE_QUERRY_LIMIT },
                updateMessagesCallback(accResponse)
              );
            }

            toast({
              title: "Response timeout",
              description:
                "The response took too long. You may see a partial response.",
              variant: "default",
            });
          }
        }, 59000);

        while (!done) {
          clearChunkTimeout();
          chunkTimeout = setTimeout(() => {
            console.log("Chunk read timeout - stream might be stuck");
          }, 30000);

          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          clearChunkTimeout();

          if (done) {
            clearStreamTimeout();
            break;
          }

          const chunkValue = decoder.decode(value);
          accResponse += chunkValue;

          clearStreamTimeout();
          streamTimeout = setTimeout(() => {
            if (!done) {
              done = true;
              reader.cancel("Stream timeout exceeded").catch(console.error);

              if (accResponse) {
                accResponse +=
                  "\n\n*Note: Response was incomplete due to timeout.*";

                utils.getMessages.setInfiniteData(
                  { fileId, limit: INFINITE_QUERRY_LIMIT },
                  updateMessagesCallback(accResponse)
                );
              }

              toast({
                title: "Response timeout",
                description:
                  "The response took too long. You may see a partial response.",
                variant: "default",
              });
            }
          }, 30000);
          utils.getMessages.setInfiniteData(
            { fileId, limit: INFINITE_QUERRY_LIMIT },
            updateMessagesCallback(accResponse)
          );
        }
      } catch (error) {
        console.error("Error during streaming:", error);
        clearStreamTimeout();
        clearChunkTimeout();

        if (accResponse) {
          accResponse +=
            "\n\n*Note: An error occurred while streaming the response.*";

          utils.getMessages.setInfiniteData(
            { fileId, limit: INFINITE_QUERRY_LIMIT },
            updateMessagesCallback(accResponse)
          );
        }

        toast({
          title: "Streaming error",
          description:
            "There was a problem with the response. You may see a partial result.",
          variant: "destructive",
        });
      } finally {
        clearStreamTimeout();
        clearChunkTimeout();
      }

      function updateMessagesCallback(currentResponse: string) {
        return (old: any) => {
          if (!old) return { pages: [], pageParams: [] };

          let isAiResponseCreated = old.pages.some((page: any) =>
            page.messages.some((message: any) => message.id === "ai-response")
          );

          let updatedPages = old.pages.map((page: any) => {
            if (page === old.pages[0]) {
              let updatedMessages;

              if (!isAiResponseCreated) {
                updatedMessages = [
                  {
                    createdAt: new Date().toISOString(),
                    id: "ai-response",
                    text: currentResponse,
                    isUserMessage: false,
                  },
                  ...page.messages,
                ];
              } else {
                updatedMessages = page.messages.map((message: any) => {
                  if (message.id === "ai-response") {
                    return {
                      ...message,
                      text: currentResponse,
                    };
                  }
                  return message;
                });
              }

              return {
                ...page,
                messages: updatedMessages,
              };
            }

            return page;
          });

          return { ...old, pages: updatedPages };
        };
      }
    },

    onError: (_, __, context) => {
      setMessage(backUpMessages.current);
      utils.getMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.getMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
