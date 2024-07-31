import { cn } from "@/lib/utils";
import { ExtendedMessages } from "@/types/messages";
import { Bot, UserRound } from "lucide-react";
import { forwardRef } from "react";
import ReactMarkdown from 'react-markdown'

interface MessageProps {
    message: ExtendedMessages
    isNextMessageSamePerson: boolean
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(({
    message,
    isNextMessageSamePerson
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn('flex items-end', {
                'justify-end': message.isUserMessage,
            })}>
            {!message.isUserMessage && (
                <div className="mr-2 bg-gray-700 rounded-md p-1">
                    <Bot className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-white" />
                </div>
            )}
            <div className={cn("max-w-[75%] max-sm:max-w-full rounded-lg inline-block text-white", {
                'bg-blue-500 rounded-br-none': message.isUserMessage,
                'bg-zinc-600 rounded-bl-none': !message.isUserMessage,
                invisible: isNextMessageSamePerson,
            })}>
                <div className={cn("p-2 max-sm:text-sm", {
                    'rounded-br-non': isNextMessageSamePerson,
                    'rounded-bl-none': !isNextMessageSamePerson,
                })}>
                    {
                        typeof message.text === 'string' ? (
                            <ReactMarkdown className="prose max-sm:prose-sm text-zinc-50">
                                {message.text}
                            </ReactMarkdown>
                        ) : (
                            message.text
                        )
                    }
                </div>
                <div className="flex justify-end m-2">
                    <span className="text-xs text-zinc-50">
                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: false,
                        })}
                    </span>
                </div>
            </div>
            {(message.isUserMessage && !isNextMessageSamePerson) && (
                <div className="ml-2 p-1 bg-blue-500 rounded-md text-white">
                    <UserRound className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
                </div>
            )}
        </div>
    )
})