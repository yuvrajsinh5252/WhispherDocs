"use client"

import { createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type streamResponse = {
    addMessage: (message: string) => void;
    messages: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
};

export const ChatContext = createContext({
    addMessage: (message: string) => {},
    messages: "",
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => {},
    isLoading: false,
});

interface Props {
    fileId: string;
    children: React.ReactNode;
}

export default function ChatContextProvider({fileId, children} : Props) {
    const [messages, setMessages] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();

    const { mutate: sendMessage} = useMutation({
        mutationFn: async ({message}: {message: string}) => {
            const response = await fetch(`/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    fileId,
                    messages,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            return response.body;
        }
    })

    return (
        <ChatContext.Provider
            value={{
                addMessage: (message: string) => {setMessages(message);},
                messages,
                handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => {setMessages(event.target.value);},
                isLoading,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}