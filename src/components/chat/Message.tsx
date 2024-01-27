import { cn } from "@/lib/utils";
import { ExtendedMessages } from "@/types/messages";
import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from 'react-markdown'

interface MessageProps {
    message: ExtendedMessages
    isNextMessageSamePerson: boolean
}

export const Message = ({
    message,
    isNextMessageSamePerson
}: MessageProps) => {
    return (
        <div className={cn('flex items-end', {
            'justify-end': message.isUserMessage,
        })}>
            {!message.isUserMessage && (
                <div className="mr-2 bg-gray-700 rounded-md p-1">
                    <Bot className="w-6 h-6 text-white" />
                </div>
            )}
            <div className={cn("max-w-[75%] rounded-lg text-white inline-block", {
                'bg-blue-500 rounded-br-none': message.isUserMessage,
                'bg-gray-500 rounded-bl-none': !message.isUserMessage,
                invisible: isNextMessageSamePerson,
            })}>
                <div className={cn("p-2", {
                    'rounded-br-non': isNextMessageSamePerson,
                    'rounded-bl-none': !isNextMessageSamePerson,
                })}>
                    {
                        typeof message.text === 'string' ? (
                            <ReactMarkdown className={cn("prose", {
                                'text-zinc-50': message.isUserMessage,
                            })}>
                                {message.text}
                            </ReactMarkdown>
                        ) : (
                            message.text
                        )
                    }
                </div>
                <div className="flex justify-end m-2">
                    <span className="text-xs text-white">
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
                    <UserRound className="w-6 h-6" />
                </div>
            )}
        </div>
    )
}