"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./chat/ChatInput";
import Messages from "./chat/Messages";
import { ModelSelector } from "./chat/ModelSelector";
import { ChevronLeft, Loader2, MessageSquare, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

interface ChatwrapperProps {
  fileId: string;
}

export default function Chatwrapper({ fileId }: ChatwrapperProps) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileId });
  const { setFileId } = useChatStore();
  const { status, sendMessage, messages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    setFileId(fileId);
  }, [fileId, setFileId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full bg-gradient-to-b from-white to-gray-50/90 dark:from-gray-900 dark:to-gray-900/90 rounded-lg backdrop-blur-sm shadow-xl border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in duration-500">
        <div className="flex items-center flex-col gap-3 p-4 sm:p-8 text-center max-w-md">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center ring-8 ring-blue-50/70 dark:ring-blue-900/20 shadow-md">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Preparing Chat
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            We&apos;re analyzing your document to make it chat-ready
          </p>
        </div>
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="flex-1 flex justify-center items-center h-full bg-gradient-to-b from-white to-gray-50/90 dark:from-gray-900 dark:to-gray-900/90 rounded-lg backdrop-blur-sm shadow-xl border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in duration-500">
        <div className="flex items-center flex-col gap-3.5 p-4 sm:p-8 text-center max-w-md animate-in fade-in zoom-in-50 duration-700">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/30 flex items-center justify-center ring-8 ring-indigo-50/70 dark:ring-indigo-900/20 shadow-md">
            <Loader2 className="animate-spin h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
            Processing Document
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            This might take a moment for larger documents
          </p>
          <div className="w-full max-w-xs mt-1">
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 w-3/5 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="flex-1 flex justify-center items-center h-full bg-gradient-to-b from-white to-gray-50/90 dark:from-gray-900 dark:to-gray-900/90 rounded-lg backdrop-blur-sm shadow-xl border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in duration-500">
        <div className="flex items-center flex-col gap-3.5 p-4 sm:p-8 text-center max-w-md animate-in fade-in zoom-in-50 duration-700">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/30 flex items-center justify-center ring-8 ring-red-50/70 dark:ring-red-900/20 shadow-md">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Processing Failed
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            Your plan supports PDFs up to 5 pages. Please upgrade for larger
            documents.
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className:
                "mt-4 gap-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm",
            })}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col justify-between bg-gradient-to-b from-white to-gray-50/90 dark:from-gray-900 dark:to-gray-900/90 rounded-lg overflow-hidden backdrop-blur-sm shadow-xl border border-gray-200/80 dark:border-gray-700/80">
      <div className="sticky top-0 left-0 right-0 z-10 flex flex-col">
        <div className="absolute w-full h-12 flex items-center bg-transparent backdrop-blur-xl border-b border-white/10 dark:border-white/10 rounded-none shadow-none py-2 px-2 sm:px-3 gap-2.5">
          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-6 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100">
            Chat with document
          </span>

          <div className="ml-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[200px] pt-5 custom-scrollbar">
        <Messages status={status} uiMessages={messages} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 dark:from-gray-900 to-transparent pt-16 pb-5 px-3 sm:px-6">
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          <ChatInput status={status} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}
