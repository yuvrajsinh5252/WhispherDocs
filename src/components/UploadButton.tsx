import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { useState } from "react";

import DropZone from "react-dropzone";
import { Cloud, File } from "lucide-react";

const UploadDropZone = () => {
    return <DropZone multiple={false} onDrop={(acceptedFile) => { console.log(acceptedFile) }}>
        {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div {...getRootProps()} className="border h-64 m-4 bg-gray-100 border-dashed border-gray-500 rounded-lg">
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