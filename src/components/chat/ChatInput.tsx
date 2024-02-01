import { Send } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useContext, useRef } from "react"
import { ChatContext } from "./ChatContext"

interface ChatInputProps {
    isDisabled: boolean
}

export default function ChatInput({ isDisabled }: ChatInputProps) {

    const {
        addMessage,
        message,
        handleInputChange,
        isLoading,
    } = useContext(ChatContext);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="flex items-center">
            <div className="w-full mx-2 mb-2 relative">
                <Textarea
                    placeholder="Enter your Question..."
                    autoFocus
                    rows={0}
                    maxRows={4}
                    className="resize-none p-4 max-sm:p-3"
                    value={message}

                    ref={textAreaRef}

                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !isLoading && !isDisabled) {
                            e.preventDefault();
                            addMessage();
                            textAreaRef.current?.focus();
                        }
                    }}

                    onChange={handleInputChange}
                />
                <Button disabled={isLoading || isDisabled} className="absolute max-sm:top-[10%] top-[14%] bottom-0 right-[8px] max-sm:p-3 p-5"
                    onClick={() => {
                        addMessage();
                        textAreaRef.current?.focus();
                    }}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}