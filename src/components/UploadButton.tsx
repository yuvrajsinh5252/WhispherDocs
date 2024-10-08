"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from '@reach/visually-hidden';
import { Button } from "./ui/button";
import { useState } from "react";
import DropZone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropZone = () => {
    const [isUploading, setIsUploading] = useState<boolean>(true);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const { startUpload } = useUploadThing("PDFUploader", {
        onUploadError: (error: Error) => void console.error(error),
    });
    const { toast } = useToast();

    const router = useRouter();

    const { mutate: startPolling } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            setIsUploading(false);
            router.push(`/dashboard/${file.id}`);
        },
        retry: true,
        retryDelay: 500,
    });

    function simulatedProgress() {
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return prev;
                }

                return prev + 5;
            });
        }, 500);

        return interval;
    }

    return <DropZone multiple={false} onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const ProgressInterval = simulatedProgress();

        const res = await startUpload(acceptedFile);

        if (!res) {
            clearInterval(ProgressInterval);
            return toast({
                title: "Error",
                description: "Something went wrong while uploading",
                variant: "destructive",
            });
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
            clearInterval(ProgressInterval);
            return toast({
                title: "Error",
                description: "Something went wrong while uploading",
                variant: "destructive",
            });
        }

        clearInterval(ProgressInterval);
        setUploadProgress(100);

        startPolling({ key });
    }}>
        {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div {...getRootProps()} className="border h-64 m-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 border-dashed border-gray-500 rounded-lg">
                <div>
                    <label htmlFor="Drop-zone-file"
                        className="flex flex-col items-center justify-center h-full cursor-pointer"
                    >
                        <span className="flex flex-col text-sm gap-2 w-full h-64 justify-center items-center text-gray-400">
                            <Cloud />
                            <p className="flex gap-3 max-sm:items-center max-sm:flex-col">
                                <span className="text-foreground">
                                    Click to Upload
                                </span>
                                or
                                <span className="text-blue-500">
                                    drag and drop
                                </span>
                            </p>
                            <p className="text-gray-400">
                                PDF (upto 4MB)
                            </p>
                            {
                                acceptedFiles && acceptedFiles[0] ? (
                                    <div className="flex justify-center items-center gap-2 border-2 rounded-lg p-2 border-black-300 bg-white">
                                        <File
                                            size={24}
                                            className="text-zinc-500"
                                        />
                                        <span className="text-zinc-500 font-bold truncate">
                                            {acceptedFiles[0].name}
                                        </span>
                                        <span className="text-zinc-500">
                                            {acceptedFiles[0].size} bytes
                                        </span>
                                    </div>
                                ) :
                                    null
                            }

                            {
                                isUploading ? (
                                    <div className="w-full mt-4 max-w-xs">
                                        <Progress value={uploadProgress} className=" bg-gray h-2 w-full" />
                                    </div>
                                ) : (
                                    uploadProgress === 100 ? (
                                        <span className="flex justify-center gap-1 items-center text-green-500 font-bold">
                                            Redirecting...
                                            <Loader2 className="animate-spin" />
                                        </span>
                                    ) : null
                                )
                            }

                            <input
                                {...getInputProps()}
                                type="file"
                                id="dropzone-file"
                                className="hidden"
                            />
                        </span>
                    </label>
                </div>
            </div>
        )}
    </DropZone>
}

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) {
                setIsOpen(v);
            }
        }} >
            <DialogTrigger onClick={() => { setIsOpen(true) }} asChild>
                <Button className="font-bold">Upload PDF</Button>
            </DialogTrigger>
            <DialogContent className="p-1">
                <VisuallyHidden>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </VisuallyHidden>
                <UploadDropZone />
            </DialogContent>
        </Dialog>
    );
}

export default UploadButton;