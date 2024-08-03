import { trpc } from "@/app/_trpc/client"
import { INFINITE_QUERRY_LIMIT } from "@/config/infiinte-querry";
import { Loader2 } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Message } from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { useIntersection } from '@mantine/hooks';
interface MessageProps {
    fileId: string;
}

export default function Messages({ fileId }: MessageProps) {
    const { isLoading: isAithinking } = useContext(ChatContext)
    const theme = localStorage.getItem('theme') ?? 'light';

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
        threshold: 1,
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    return (
        <div className="m-2 max-sm:m-0 max-sm:mb-1 p-2 overflow-y-scroll scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2 rounded-md flex flex-col-reverse gap-2">
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
                        <SkeletonTheme {
                            ...{
                                baseColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
                                highlightColor: theme === "dark" ? "#374151" : "#E5E7EB",
                            }
                        }>
                            <Skeleton style={
                                {
                                    display: "flex",
                                    height: "10vh",
                                }
                            } count={10} />
                        </SkeletonTheme>
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