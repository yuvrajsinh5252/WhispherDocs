import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { useState } from "react";

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
                Drag and drop your PDF file here
            </DialogContent>
        </Dialog>
    );
}

export default UploadButton;