"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import PDFfullscreen from "./PDFfullscreen";
import { useScreenSize } from "@/hooks/useScreenSize";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFRendererProps {
  url: string;
}

export default function PDFrenderer({ url }: PDFRendererProps) {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  const handleZoom = (newZoom: number) => {
    setZoom((prevZoom) => {
      const updatedZoom = prevZoom + newZoom;
      return Math.min(Math.max(0.5, updatedZoom), 2);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1.5 border-b border-gray-200 dark:border-gray-700 p-2">
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
            className="h-8 w-8 p-0"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
              onBlur={() => {
                if (pageNumber < 1) setPageNumber(1);
                if (pageNumber > numPages) setPageNumber(numPages);
              }}
              className="w-14 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 select-none">
              / {numPages}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber >= numPages}
            onClick={() => handlePageChange(pageNumber + 1)}
            className="h-8 w-8 p-0"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center sm:ml-auto gap-0.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(-0.25)}
            className="h-8 w-8 p-0"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <Search className="h-3.5 w-3.5 opacity-50" />
                <span>{Math.round(zoom * 100)}%</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setZoom(0.5)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(0.25)}
            className="h-8 w-8 p-0"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="h-8 w-8 p-0"
            aria-label="Rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PDFfullscreen url={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen overflow-hidden">
        <SimpleBar
          autoHide={false}
          className="h-full max-h-[calc(100vh-10rem)]"
        >
          <div
            ref={ref}
            className="min-h-full flex justify-center bg-gray-100/50 dark:bg-gray-800/50"
          >
            <Document
              file={url}
              className="max-w-full"
              loading={
                <div className="flex justify-center items-center min-h-[600px]">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading PDF...
                    </p>
                  </div>
                </div>
              }
              onLoadError={(error) => {
                toast({
                  title: "Error loading PDF",
                  description: error.message,
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page
                pageNumber={pageNumber}
                width={width ? width * 0.9 : undefined}
                scale={zoom}
                rotate={rotation}
                className="max-w-full mx-auto"
                loading={
                  <div className="flex justify-center min-h-[600px] items-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(zoom)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
