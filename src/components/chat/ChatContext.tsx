"use client"

import { createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";

type streamResponse = {
    addMessage: () => void,
    message: string,
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading: boolean,
};

export const ChatContext = createContext<streamResponse>({
    addMessage: () => {},
    message: "",
    handleInputChange: () => {},
    isLoading: false,
});

interface Props {
    fileId: string;
    children: React.ReactNode;
}

export default function ChatContextProvider({fileId, children} : Props) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: sendMessage} = useMutation({
        mutationFn: async ({message}: {message: string}) => {
            const response = await fetch(`/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    fileId,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            return response.body;
        }
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    }

    const addMessage = () => sendMessage({ message });

    return (
        <ChatContext.Provider
            value={{
                addMessage,
                message,
                handleInputChange,
                isLoading,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}