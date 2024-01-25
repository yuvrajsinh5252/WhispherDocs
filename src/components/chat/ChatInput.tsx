import { Send } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

interface ChatInputProps {
    isDisabled: boolean
}

export default function ChatInput({ isDisabled }: ChatInputProps) {
    return (
        <div className="flex items-center">
            <form className="w-full mx-2 mb-2 relative">
                <Textarea
                    placeholder="Enter your Question..."
                    autoFocus
                    rows={0}
                    maxRows={4}
                    className="resize-none p-4"
                />
                <Button className="absolute top-[14%] bottom-0 right-[8px] p-5">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}