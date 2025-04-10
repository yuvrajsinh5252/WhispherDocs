"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, MessageSquare, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import ChatContextProvider from "./ChatContext";

interface ChatwrapperProps {
  fileId: string;
}

export default function Chatwrapper({ fileId }: ChatwrapperProps) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileId });

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center flex-col gap-2 p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">Preparing Chat</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We're analyzing your document to make it chat-ready
          </p>
        </div>
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="h-full w-full flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center flex-col gap-2 p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium">Processing Document</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This might take a moment for larger documents
          </p>
          <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-indigo-500 h-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="h-full w-full flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center flex-col gap-2 p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium">Processing Failed</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Your plan supports PDFs up to 5 pages. Please upgrade for larger
            documents.
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "mt-4",
            })}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex h-full flex-col justify-between overflow-hidden bg-white dark:bg-gray-900 rounded-lg">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent z-10 flex items-center px-4">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
            <span>Chat with your document</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-12 px-4">
          <Messages fileId={fileId} />
        </div>

        <div className="p-4 pt-0">
          <ChatInput isDisabled={false} />
        </div>
      </div>
    </ChatContextProvider>
  );
}
