'use client'

import { ChevronDown, Loader2, RotateCw, Search } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from './ui/button';
import SimpleBar from 'simplebar-react';
import PDFfullscreen from './PDFfullscreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFRenedererProps {
    url: string
}

export default function PDFrenderer({ url }: PDFRenedererProps) {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const { toast } = useToast();
    const { ref, width } = useResizeDetector();

    return (
        <div>
            <div className='flex border-b items-center justify-between p-2'>
                <div className='flex items-center gap-2 max-sm:gap-1'>
                    <Input
                        type='number'
                        className='w-20 h-10 max-sm:w-10'
                        min={1} max={numPages}
                        value={pageNumber}
                        onChange={(e) => setPageNumber(parseInt(e.target.value))}
                    />
                    <p className='text-zinc-700 dark:text-white text-sm space-x-1'>
                        <span>/</span>
                        <span>{numPages}</span>
                    </p>
                </div>
                <div className='flex gap-2 max-sm:gap-0'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='flex items-center gap-2 text-lg' asChild>
                            <Button variant='ghost' aria-label='zoom' className='flex gap-2'>
                                <Search className='h-5 w-5' />
                                <span>{zoom * 100}%</span>
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setZoom(0.5)}>50%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setZoom(0.67)}>67%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setZoom(0.75)}>75%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setZoom(1)}>100%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setZoom(1.5)}>150%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setZoom(2)}>200%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setZoom(2.5)}>250%</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant='ghost' aria-label='rotate 90 degrees'
                        onClick={() => setRotation(rotation + 90)}
                    >
                        <RotateCw className='h-5 w-5' />
                    </Button>
                    <PDFfullscreen url={url}/>
                </div>
            </div>
            <SimpleBar className='h-screen' autoHide={false}>
                <div ref={ref}>
                    <Document
                        file={url}
                        className="rounded-lg max-h-full items-center flex justify-center"
                        loading={
                            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
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
                        <Page
                            width={width}
                            pageNumber={pageNumber}
                            scale={zoom}
                            rotate={rotation}
                        />
                    </Document>
                </div>
            </SimpleBar>
        </div>
    )
}