import { trpc } from "@/app/_trpc/client"
import { INFINITE_QUERRY_LIMIT } from "@/config/infiinte-querry";
import { Loader2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Message } from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { useIntersection } from '@mantine/hooks';
interface MessageProps {
    fileId: string;
}

export default function Messages({ fileId }: MessageProps) {

    const { isLoading: isAithinking } = useContext(ChatContext)

    const { data, isLoading, fetchNextPage } = trpc.getMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERRY_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

    const messages = data?.pages.flatMap((page) => page.messages);

    const loadingMessage = {
        createdAt: new Date().toISOString(),
        id: 'loading-message',
        isUserMessage: false,
        text: (
            <span className="flex h-4 items-center justify-center">
                <Loader2 className="animate-spin h-4 w-4" />
            </span>
        )
    }

    const CombinedMessage = [
        ...(isAithinking ? [loadingMessage] : []),
        ...(messages ?? []),
    ]

    const lastMessageRef = useRef<HTMLDivElement>(null)

    const { ref, entry } = useIntersection({
        root: lastMessageRef.current,
        threshold: 0,
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    return (
        <div className="m-2 max-sm:p-0 p-2 overflow-y-scroll scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-sm:h-[24rem] rounded-md h-full flex flex-col-reverse gap-2">
            {CombinedMessage && CombinedMessage.length > 0 ? (
                CombinedMessage.map((message, i) => {

                    const isNextMessageSamePerson =
                        CombinedMessage[i - 1]?.isUserMessage === CombinedMessage[i]?.isUserMessage

                    if (i == CombinedMessage.length - 1)
                        return <Message
                            ref={ref}
                            message={message}
                            isNextMessageSamePerson={isNextMessageSamePerson}
                            key={message.id}
                        />
                    else
                        return <Message
                            message={message}
                            isNextMessageSamePerson={isNextMessageSamePerson}
                            key={message.id}
                        />
                })
            ) :
                isLoading ? (
                    <div className="flex gap-5 flex-col">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />

                    </div>
                ) : (
                    <div className="flex h-full font-semibold justify-center items-center">
                        No messages yet
                    </div>
                )
            }
        </div>
    )
}