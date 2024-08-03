import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Maximize } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

export default function PDFfullscreen({ url }: { url: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [numPages, setNumPages] = useState(1);
    const { ref, width } = useResizeDetector();

    return (
        <Dialog
            onOpenChange={(v) => { if (!v) setIsOpen(v) }}
        >
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button variant='ghost' className="max-sm:p-0" aria-label='fullscreen'>
                    <Maximize className='h-5 w-5' />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full">
                <SimpleBar
                    className="max-h-[calc(100vh-10rem)] mt-6"
                >
                    <div ref={ref}>
                        <Document
                            file={url}
                            className="rounded-lg max-h-full flex-col items-center flex justify-center"
                            loading={
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="m-auto animate-spin" size={50} />
                                </div>
                            }

                            onLoadError={(error) => {
                                toast({
                                    title: "Error Loading PDF",
                                    description: error.message,
                                    variant: "destructive",
                                });
                            }}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        >
                            {
                                new Array(numPages).fill(0).map((_, i) => (
                                    <Page
                                        key={i}
                                        width={width ? width : 1}
                                        pageNumber={i + 1}
                                    />
                                ))
                            }
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    );
}