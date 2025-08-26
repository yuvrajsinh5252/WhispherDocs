import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_MODEL, ModelId } from "@/lib/chat-api/constants";

export interface ChatMessage {
  createdAt: string;
  id: string;
  text: string;
  isUserMessage: boolean;
  thinking?: string;
  hasThinking: boolean;
}

export interface ChatState {
  // State
  message: string;
  isLoading: boolean;
  selectedModel: ModelId | undefined;
  fileId: string | undefined;
  messages: ChatMessage[];

  // Actions
  setSelectedModel: (model: ModelId) => void;
  setFileId: (fileId: string) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addMessage: () => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    message: "",
    isLoading: false,
    selectedModel: DEFAULT_MODEL,
    fileId: undefined,
    messages: [],

    // Actions
    setSelectedModel: (model: ModelId) => set({ selectedModel: model }),

    setFileId: (fileId: string) => set({ fileId }),

    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      set({ message: event.target.value }),

    addMessage: async () => {
      const { message, selectedModel, fileId } = get();

      if (!message.trim()) return;

      // Store the message and clear input
      const userMessage = message;
      set({ message: "", isLoading: true });

      // Add user message to state
      const userMessageObj: ChatMessage = {
        createdAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        text: userMessage,
        isUserMessage: true,
        hasThinking: false,
      };

      set((state) => ({
        messages: [userMessageObj, ...state.messages],
      }));

      try {
        const response = await fetch("/api/message", {
          method: "POST",
          body: JSON.stringify({
            fileId,
            message: userMessage,
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const stream = response.body;
        if (!stream) {
          throw new Error("No response stream");
        }

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accResponse = "";
        let accThinking = "";

        // Create initial AI message
        const aiMessageObj: ChatMessage = {
          createdAt: new Date().toISOString(),
          id: "ai-response",
          text: "",
          isUserMessage: false,
          thinking: "",
          hasThinking: false,
        };

        set((state) => ({
          messages: [aiMessageObj, ...state.messages],
        }));

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
                    set((state) => ({
                      messages: state.messages.map((msg) =>
                        msg.id === "ai-response"
                          ? {
                              ...msg,
                              text: accResponse,
                              thinking: accThinking,
                              hasThinking: !!accThinking,
                            }
                          : msg
                      ),
                    }));
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

          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === "ai-response"
                ? {
                    ...msg,
                    text: accResponse,
                    thinking: accThinking,
                    hasThinking: !!accThinking,
                  }
                : msg
            ),
          }));
        }

        // Finalize the AI message with a proper ID
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === "ai-response" ? { ...msg, id: crypto.randomUUID() } : msg
          ),
        }));
      } catch (error) {
        console.error("Error sending message:", error);
        // Revert the user message on error
        set({ message: userMessage });
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);
