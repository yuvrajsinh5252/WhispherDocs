"use client"

import { trpc } from "@/app/_trpc/client";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { format } from 'date-fns'
import { FileText, Ghost, Loader2, MessageSquareCode, Plus, Trash } from 'lucide-react'
import { Button } from "./ui/button";
import { useState } from "react";
import UploadButton from "./UploadButton";
import Link from "next/link";

const DashboardComponent = () => {
    const utils = trpc.useUtils();
    const [deletingFile, setDeletingFile] = useState(String);

    const theme = "dark";

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
            <div className="h-[calc(100vh-15.25rem)] flex gap-2 justify-center">
                {
                    file && file.length != 0 ? (
                        <div className="w-full">
                            <div className="flex flex-wrap gap-20 max-sm:justify-around mx-10 justify-normal py-10">
                                {
                                    file.map((item, index) => (
                                        <div key={index}
                                            className="border shadow dark:bg-gray-900 hover:shadow-lg rounded-lg w-[470px]">
                                            <div className="divide-y divide-gray-200">
                                                <Link href={`/dashboard/${item.id}`}>
                                                    <div className="flex items-center px-6 gap-5 justify-start h-[82px]">
                                                        <FileText />
                                                        <div className="w-[200px] truncate">
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="flex justify-around text-gray-600 dark:text-gray-300 gap-14 w-full p-2">
                                                    <span className="flex items-center gap-2 text-xs">
                                                        <div>
                                                            <Plus size={15} />
                                                        </div>
                                                        {format(new Date(item.createdAt), "MMM yyyy")}
                                                    </span>
                                                    <span className="text-xs">
                                                        <a className="flex gap-1 w-full" href={item.url} target="_blank" rel="noreferrer">
                                                            <div>
                                                                <MessageSquareCode size={20} />
                                                            </div>
                                                            <div className="flex w-[100px] truncate">{item.name}</div>
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
                    ) : isLoading ? (
                        <SkeletonTheme {
                            ...{
                                baseColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
                                highlightColor: theme === "dark" ? "#374151" : "#E5E7EB",
                            }
                        }>
                            <Skeleton style={
                            {
                                display: "flex",
                                marginTop: "1.5rem",
                                width: "58vw",
                                height: "10vh",

                                minWidth: "350px",
                            }
                        } count={4}/>
                        </SkeletonTheme>
                    ) : (
                        <div className="m-auto">
                            <h1 className="m-auto flex items-center flex-col gap-3 text-lg">
                                <Ghost />
                                No files uploaded yet
                            </h1>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default DashboardComponent