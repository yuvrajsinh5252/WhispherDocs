import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useContext();

  const { toast } = useToast();

  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
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
      backupMessage.current = message;
      setMessage("");

      // step 1
      await utils.getMessages.cancel();

      // step 2
      const previousMessages = utils.getMessages.getInfiniteData({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      });

      // step 3
      utils.getMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old: any) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];

          if (newPages.length === 0) {
            // If there are no pages, create a new one
            return {
              ...old,
              pages: [
                {
                  messages: [
                    {
                      createdAt: new Date().toISOString(),
                      id: crypto.randomUUID(),
                      text: message,
                      isUserMessage: true,
                    },
                  ],
                  nextCursor: null,
                },
              ],
            };
          }

          let latestPage = { ...newPages[0] };

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

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        utils.getMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old: any) => {
            if (!old) return { pages: [], pageParams: [] };

            if (old.pages.length === 0) {
              return {
                ...old,
                pages: [
                  {
                    messages: [
                      {
                        createdAt: new Date().toISOString(),
                        id: "ai-response",
                        text: accResponse,
                        isUserMessage: false,
                      },
                    ],
                    nextCursor: null,
                  },
                ],
              };
            }

            let isAiResponseCreated = old.pages.some((page: any) =>
              page.messages.some((message: any) => message.id === "ai-response")
            );

            let updatedPages = old.pages.map((page: any, pageIndex: number) => {
              if (pageIndex === 0) {
                let updatedMessages;

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message: any) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
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
          }
        );
      }

      utils.getMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old: any) => {
          if (!old) return { pages: [], pageParams: [] };

          let updatedPages = old.pages.map((page: any, pageIndex: number) => {
            if (pageIndex === 0) {
              let updatedMessages = page.messages.map((message: any) => {
                if (message.id === "ai-response") {
                  return {
                    ...message,
                    id: crypto.randomUUID(),
                  };
                }
                return message;
              });

              return {
                ...page,
                messages: updatedMessages,
              };
            }
            return page;
          });

          return { ...old, pages: updatedPages };
        }
      );
    },

    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      setTimeout(async () => {
        await utils.getMessages.invalidate({ fileId });
      }, 500);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
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
};
