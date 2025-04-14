"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, MessageSquare, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ChatContextProvider } from "./ChatContext";

interface ChatwrapperProps {
  fileId: string;
}

export default function Chatwrapper({ fileId }: ChatwrapperProps) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileId });

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center flex-col gap-3 p-4 sm:p-8 text-center max-w-md animate-in fade-in duration-700">
          <div className="h-12 w-12 rounded-full bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center ring-8 ring-blue-50 dark:ring-blue-900/10">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Preparing Chat
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            We&apos;re analyzing your document to make it chat-ready
          </p>
        </div>
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="flex-1 flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center flex-col gap-3 p-4 sm:p-8 text-center max-w-md animate-in fade-in duration-700">
          <div className="h-12 w-12 rounded-full bg-indigo-100/80 dark:bg-indigo-900/30 flex items-center justify-center ring-8 ring-indigo-50 dark:ring-indigo-900/10">
            <Loader2 className="animate-spin h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            Processing Document
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            This might take a moment for larger documents
          </p>
          <div className="w-full max-w-xs mt-2">
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-3/5 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="flex-1 flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center flex-col gap-3 p-4 sm:p-8 text-center max-w-md animate-in fade-in duration-700">
          <div className="h-12 w-12 rounded-full bg-red-100/80 dark:bg-red-900/30 flex items-center justify-center ring-8 ring-red-50 dark:ring-red-900/10">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Processing Failed
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Your plan supports PDFs up to 5 pages. Please upgrade for larger
            documents.
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className:
                "mt-4 gap-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800",
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
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex h-full flex-col justify-between bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-14 sm:h-16 bg-gradient-to-b from-white dark:from-gray-900 via-white/90 dark:via-gray-900/90 to-transparent z-10 flex items-center px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
              Chat with your document
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-14 sm:pt-16 pb-[140px] sm:pb-[180px]">
          <Messages fileId={fileId} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-900 pt-6 pb-4 px-3 sm:px-6">
          <ChatInput isDisabled={false} />
        </div>
      </div>
    </ChatContextProvider>
  );
}
