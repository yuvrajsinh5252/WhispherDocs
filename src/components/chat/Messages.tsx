import { trpc } from "@/app/_trpc/client"

export default function Messages({fileId} : {fileId: string}) {

    const { data: messages } = trpc.getMessages.useQuery({ fileId });

    return (
        <div className="border-2 m-2 max-sm:hidden rounded-md h-full">
            {messages?.map((message) => {
                return (
                    <div key={message.id} className="flex flex-col p-2">
                        <div className="flex flex-row">
                            <div className="flex flex-col">
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}