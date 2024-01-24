'use client'

import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import { Input } from "@/components/ui/input"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFRenedererProps {
    url: string
}

export default function PDFrenderer({ url }: PDFRenedererProps) {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    const { toast } = useToast();
    const { ref, width } = useResizeDetector();

    return (
        <div>
            <div className='flex border-b items-center gap-2 p-2'>
                <Input
                    type='number'
                    className='w-20 h-10'
                    min={1} max={numPages}
                    value={pageNumber}
                    onChange={(e) => setPageNumber(parseInt(e.target.value))}
                />
                <p className='text-zinc-700 dark:text-white text-sm space-x-1'>
                    <span>/</span>
                    <span>{numPages}</span>
                </p>
            </div>
            <div ref={ref}>
                <Document
                    file={url}
                    className="rounded-lg max-h-full items-center flex justify-center"
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
                    <Page width={width} pageNumber={pageNumber} />
                </Document>
            </div>
        </div>
    )
}