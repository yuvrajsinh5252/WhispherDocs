'use client';

import { trpc } from "@/app/_trpc/client"
import ChatInput from "./ChatInput"
import Messages from "./Messages"
import { ChevronDown, ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface ChatwrapperProps {
    fileId: string
}

export default function Chatwrapper({ fileId }: ChatwrapperProps) {

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileId }, {
        refetchInterval: 1000,
    }
    );

if (isLoading) {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="flex items-center flex-col gap-1.5">
                <Loader2 className="animate-spin h-8 w-8 text-blue-400 max-sm:hidden" />
                <span className="text-lg font-semibold">Loading...</span>
                <span className="text-sm font-light max-sm:hidden">
                    Preparing Your PDF
                </span>
            </div>
        </div>
    )
}

if (data?.status === "SUCCESS") {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="flex items-center flex-col gap-1.5">
                <Loader2 className="animate-spin h-8 w-8 text-blue-400 max-sm:hidden" />
                <span className="text-lg font-semibold">Processing...</span>
                <span className="text-sm font-light max-sm:hidden">
                    This might take a while
                </span>
            </div>
        </div>
    )
}

if (data?.status === "FAILED") {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="flex items-center max-sm:flex-row flex-col gap-1.5">
                <XCircle className="h-8 w-8 text-red-400 max-sm:hidden" />
                <span className="text-lg font-semibold">Failed to process PDF</span>
                <span className="text-sm font-light max-sm:hidden">
                    your plan supports only 5 page PDFs
                </span>
                <Link href='/dashboard' className={buttonVariants({
                    variant: "secondary",
                    className: "mt-4"
                })
                }>
                    <ChevronLeft className="h-8 w-8 text-blue-400" />
                    Back
                </Link>
            </div>
        </div>
    )
}

return (
    <div className="flex h-full flex-col w-full">
        <Messages />
        <ChatInput isDisabled />
    </div>
)
}