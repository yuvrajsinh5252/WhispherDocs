"use client"

import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFRenedererProps {
    url: string
}

export default function PDFrenderer({url} : PDFRenedererProps) {
    return (
        <Document file={url} className="max-h-full">
            <Page pageNumber={1} />
        </Document>
    )
}