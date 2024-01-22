"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { use, useState } from "react";

import DropZone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "./ui/progress";
import { clear } from "console";
import { set } from "date-fns";
import { useUploadThing } from "@/lib/uploadthing";

const UploadDropZone = () => {
    const [isUploading, setIsUploading] = useState<boolean>(true);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const {startUpload} = useUploadThing("PDFUploader");

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

    return <DropZone multiple={false} onDrop={(acceptedFile) => {
        setIsUploading(true);
        const ProgressInterval = simulatedProgress();
        clearInterval(ProgressInterval);
        setUploadProgress(100);
    }}>
        {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div {...getRootProps()} className="border h-64 m-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 border-dashed border-gray-500 rounded-lg">
                <div>
                    <label htmlFor="Drop-zone-file"
                        className="flex flex-col items-center justify-center h-full cursor-pointer"
                    >
                        <span className="flex flex-col text-sm gap-2 w-full h-64 justify-center items-center text-gray-400">
                            <Cloud />
                            <p className="flex gap-3">
                                <span className="text-gray-400 font-bold">
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
                                    <div className="flex justify-center items-center gap-2 border-2 rounded-sm p-2 border-black-200">
                                        <File
                                            size={24}
                                            className="text-gray-400"
                                        />
                                        <span className="text-gray-400 font-bold">
                                            {acceptedFiles[0].name}
                                        </span>
                                        <span className="text-gray-400">
                                            {acceptedFiles[0].size} bytes
                                        </span>
                                    </div>
                                ) :
                                    null
                            }

                            {
                                isUploading ? (
                                    <div className="w-full mt-4 max-w-xs">
                                        <Progress value={uploadProgress} className="h-2 w-full" />
                                    </div>
                                ) : null
                            }
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
            <DialogContent>
                <UploadDropZone />
            </DialogContent>
        </Dialog>
    );
}

export default UploadButton;