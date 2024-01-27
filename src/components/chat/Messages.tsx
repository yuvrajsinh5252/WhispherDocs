import { trpc } from "@/app/_trpc/client"
import { INFINITE_QUERRY_LIMIT } from "@/config/infiinte-querry";
import { Loader2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Message } from "./Message";

interface MessageProps {
    fileId: string;
}

export default function Messages({ fileId }: MessageProps) {

    const { data, isLoading, fetchNextPage } = trpc.getMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERRY_LIMIT,
    }, {
        getNextPageParam: (lastPage) => (lastPage?.nextCursor),
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
        ...(true ? [loadingMessage] : []),
        ...(messages ?? []),
    ]

    return (
        <div className="border-2 m-2 p-2 no-scrollbar max-sm:hidden rounded-md h-full overflow-y-scroll flex flex-col gap-2">
            {CombinedMessage && CombinedMessage.length > 0 ? (
                CombinedMessage.map((message, i) => {

                    const isNextMessageSamePerson =
                        CombinedMessage[i - 1]?.isUserMessage === CombinedMessage[i]?.isUserMessage

                    if (i === CombinedMessage.length - 1)
                        return <Message
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
                    <div>
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                    </div>
                ) : (
                    <div>
                        No messages yet
                    </div>
                )
            }
        </div>
    )
}