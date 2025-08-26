"use client";

import { useChat } from "@ai-sdk/react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ModelSelector } from "./ModelSelector";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/stores/chatStore";
import { ModelId } from "@/lib/chat-api/constants";

interface AIChatProps {
  fileId: string;
  model: ModelId;
}

export default function AIChat({ fileId, model }: AIChatProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat();
  const { selectedModel } = useChatStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    // prefer runtime-selected model from selector if available
    const activeModel = selectedModel ?? model;
    sendMessage({ text: input, metadata: { fileId, model: activeModel } });
    setInput("");
  };

  const uiMessages = useMemo(() => {
    const mapped = messages.map((m) => {
      const raw = m.parts
        .filter((p) => p.type === "text")
        .map((p: any) => p.text as string)
        .join("");
      const visible = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
      return {
        id: m.id,
        createdAt: new Date().toISOString(),
        isUserMessage: m.role === "user",
        text: visible,
      } as const;
    });

    // mimic previous loading bubble when streaming
    if (status !== "ready") {
      mapped.unshift({
        id: "loading-message",
        createdAt: new Date().toISOString(),
        isUserMessage: false,
        text: "Processing...",
      } as const);
    }

    return mapped;
  }, [messages, status]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pt-4 pb-[200px] sm:pb-[240px] px-3 sm:px-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600 scrollbar-thumb-rounded-full">
        <div className="flex flex-col-reverse gap-1 sm:gap-2">
          <div className="h-1" />
          {uiMessages
            .slice()
            .reverse()
            .map((m, i, arr) => {
              const prev = arr[i - 1];
              const isNextSame =
                prev && (prev as any).isUserMessage === m.isUserMessage;
              return (
                <div
                  key={m.id}
                  className={
                    "flex items-end my-1.5 sm:my-2 transition-all " +
                    (m.isUserMessage ? "justify-end" : "")
                  }
                >
                  {!m.isUserMessage && !isNextSame && (
                    <div className="flex-shrink-0 mr-2 max-sm:hidden">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-indigo-800/50 dark:to-indigo-600/30 flex items-center justify-center shadow-md border border-indigo-200/50 dark:border-indigo-600/30" />
                    </div>
                  )}
                  {!m.isUserMessage && isNextSame && (
                    <div className="w-8 sm:w-9 mr-2" />
                  )}
                  <div
                    className={
                      "sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 transition-all hover:shadow-lg " +
                      (m.isUserMessage
                        ? "bg-gradient-to-br from-indigo-500/90 to-violet-600/90 text-white backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-md hover:shadow-indigo-500/20"
                        : "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/90 dark:to-gray-700/80 text-gray-100 backdrop-blur-sm shadow-md border border-indigo-100 dark:border-gray-600/50 hover:border-indigo-200 dark:hover:border-gray-500/50")
                    }
                  >
                    {m.id === "loading-message" ? (
                      <div className="flex items-center justify-start space-x-3">
                        <div className="flex space-x-1.5 py-0.5">
                          <div
                            className="h-2.5 w-2.5 bg-indigo-400 rounded-full animate-bounce shadow-sm"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="h-2.5 w-2.5 bg-indigo-400 rounded-full animate-bounce shadow-sm"
                            style={{ animationDelay: "200ms" }}
                          />
                          <div
                            className="h-2.5 w-2.5 bg-indigo-400 rounded-full animate-bounce shadow-sm"
                            style={{ animationDelay: "400ms" }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          Processing...
                        </span>
                      </div>
                    ) : (
                      <div className="prose prose-xs dark:prose-invert max-w-none">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 dark:from-gray-900 dark:via-gray-900/95 to-transparent pt-6 pb-5 px-3 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center relative">
            <ModelSelector />
            {status !== "ready" && (
              <button
                type="button"
                onClick={stop}
                className="absolute right-0 h-8 px-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
              >
                Stop
              </button>
            )}
          </div>
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={status !== "ready"}
            error={error}
          />
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400 text-center font-medium">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
