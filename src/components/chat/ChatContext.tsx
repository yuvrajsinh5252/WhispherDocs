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
  selectedModel?: string;
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
  selectedModel?: string;
}

export const ChatContextProvider = ({
  fileId,
  children,
  selectedModel,
}: Props) => {
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
          model: selectedModel,
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
      setIsLoading(true);

      await utils.getMessages.cancel();

      const previousMessages = utils.getMessages.getInfiniteData({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      });

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
      let accThinking = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        if (chunkValue.includes('"type":"thinking"')) {
          const lines = chunkValue.split("\n");
          for (const line of lines) {
            if (line.trim() && line.includes('"type":"thinking"')) {
              try {
                const thinkingData = JSON.parse(line);
                if (thinkingData.type === "thinking") {
                  accThinking += thinkingData.content || "";

                  utils.getMessages.setInfiniteData(
                    { fileId, limit: INFINITE_QUERY_LIMIT },
                    (old: any) => {
                      if (!old) return { pages: [], pageParams: [] };

                      return {
                        ...old,
                        pages: old.pages.map((page: any, pageIndex: number) => {
                          if (pageIndex === 0) {
                            return {
                              ...page,
                              messages: page.messages.map((message: any) => {
                                if (message.id === "ai-response") {
                                  return {
                                    ...message,
                                    thinking: accThinking,
                                  };
                                }
                                return message;
                              }),
                            };
                          }
                          return page;
                        }),
                      };
                    }
                  );
                }
              } catch (e) {
                accResponse += line;
              }
            } else if (line.trim()) {
              accResponse += line;
            }
          }
        } else {
          accResponse += chunkValue;
        }

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
                        thinking: accThinking || undefined,
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
                      thinking: accThinking || undefined,
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
                        thinking: accThinking || undefined,
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
      }, 1000);
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
        selectedModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
