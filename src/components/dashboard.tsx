"use client"

import { trpc } from "@/app/_trpc/client";
import Skeleton from 'react-loading-skeleton'
import { format } from 'date-fns'
import { FileText, Loader2, MessageSquareCode, Trash } from 'lucide-react'
import { Button } from "./ui/button";
import { useState } from "react";

const DashboardComponent = () => {
    const utils = trpc.useUtils();
    const [deletingFile, setDeletingFile] = useState(String);

    const { data: file, isLoading } = trpc.getUserFiles.useQuery();
    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate();
        },

        onMutate({ id }) {
            setDeletingFile(id);
        },

        onSettled() {
            setDeletingFile("");
        }
    });

    return (
        <div className="divide-y-2">
            <div>
                <header>My Files</header>

            </div>
            <div className="h-screen flex gap-2 py-10 px-16">
                {
                    file && file.length != 0 ? (
                        <div className="w-full">
                            <div className="flex flex-wrap gap-20">
                                {
                                    file.map((item, index) => (
                                        <div key={index}
                                            className="shadow-lg dark:shadow-none dark:bg-transparent dark:border-white border-2 w-96 h-36 hover:shadow-xl rounded-sm flex justify-around items-center flex-col divide-y-2">
                                            <div className="flex items-center px-6 gap-5 justify-start h-[inherit] w-[inherit]">
                                                <FileText />
                                                <div>
                                                    {item.name}
                                                </div>
                                            </div>
                                            <div className="flex gap-16 w-[inherit] justify-center items-center p-2">
                                                <span className="text-xs">{format(new Date(item.createdAt), "MMM yyyy")}</span>
                                                <span className="text-xs">
                                                    <a className="" href={item.url} target="_blank" rel="noreferrer">
                                                        <MessageSquareCode />
                                                        <div>{item.name}</div>
                                                    </a>
                                                </span>
                                                <Button size="sm" className="w-full min-w-[166px]:" variant="destructive"
                                                    onClick={() => { deleteFile({ id: item.id }) }}
                                                >
                                                    {
                                                        deletingFile === item.id ?
                                                            <Loader2 className="animate-spin" /> : <Trash />
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ) : isLoading ? (<Skeleton style={
                        {
                            width: "20vw",
                            height: "10vh"
                        }
                    } />) : (
                        <div className="w-full">
                            <div className="flex flex-wrap justify-center">
                                <div className="bg-red-400 w-80 h-52">
                                    No file found
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default DashboardComponent