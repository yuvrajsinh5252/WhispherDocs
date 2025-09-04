import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_MODEL } from "@/lib/chat-api/constants";
import { ModelId } from "@/lib/chat-api/models";

export interface ChatState {
  selectedModel: ModelId | undefined;
  fileId: string | undefined;

  setSelectedModel: (model: ModelId) => void;
  setFileId: (fileId: string) => void;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    aiMessages: [],
    selectedModel: DEFAULT_MODEL,
    fileId: undefined,
    setSelectedModel: (model: ModelId) => set({ selectedModel: model }),

    setFileId: (fileId: string) => set({ fileId }),
  }))
);
