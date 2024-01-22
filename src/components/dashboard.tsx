"use client"

import { trpc } from "@/app/_trpc/client";
import Skeleton from 'react-loading-skeleton'
import { format } from 'date-fns'
import { FileText, Loader2, MessageSquareCode, Trash } from 'lucide-react'
import { Button } from "./ui/button";
import { useState } from "react";
import UploadButton from "./UploadButton";
import Link from "next/link";

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
            <div className="flex max-sm:justify-around max-sm:px-0 justify-between px-10 py-10  items-center">
                <h1 className="text-2xl font-bold">My Files</h1>
                <UploadButton />
            </div>
            <div className="h-screen flex gap-2">
                {
                    file && file.length != 0 ? (
                        <div className="w-full">
                            <div className="flex flex-wrap gap-20 max-sm:justify-around mx-10 justify-normal py-10">
                                {
                                    file.map((item, index) => (
                                        <div key={index}
                                            className="border shadow dark:bg-gray-900 hover:shadow-lg rounded-lg w-[395px]">
                                            <div className="divide-y divide-gray-200">
                                                <Link href={`/dashboard/${item.id}`}>
                                                    <div className="flex items-center px-6 gap-5 justify-start h-[82px]">
                                                        <FileText />
                                                        <div className="w-[100px] truncate">
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="flex gap-16 w-[inherit] justify-center items-center p-2">
                                                    <span className="text-xs">{format(new Date(item.createdAt), "MMM yyyy")}</span>
                                                    <span className="text-xs w-[130px] truncate">
                                                        <a className="flex flex-col justify-center items-start gap-1" href={item.url} target="_blank" rel="noreferrer">
                                                            <MessageSquareCode />
                                                            <div>{item.name}</div>
                                                        </a>
                                                    </span>
                                                    <Button size="sm" className="w-full" variant="destructive"
                                                        onClick={() => { deleteFile({ id: item.id }) }}
                                                    >
                                                        {
                                                            deletingFile === item.id ?
                                                                <Loader2 className="animate-spin" /> : <Trash />
                                                        }
                                                    </Button>
                                                </div>
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