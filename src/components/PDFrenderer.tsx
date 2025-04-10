"use client";

import { ChevronDown, Loader2, RotateCw, Search } from "lucide-react";
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
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import SimpleBar from "simplebar-react";
import PDFfullscreen from "./PDFfullscreen";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFRenedererProps {
  url: string;
}

export default function PDFrenderer({ url }: PDFRenedererProps) {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
            className={cn(
              "h-8 w-8 p-0 opacity-75 hover:opacity-100 transition-opacity",
              pageNumber <= 1 && "opacity-40"
            )}
          >
            <span className="sr-only">Previous page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
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
              / <span>{numPages}</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber >= numPages}
            onClick={() => handlePageChange(pageNumber + 1)}
            className={cn(
              "h-8 w-8 p-0 opacity-75 hover:opacity-100 transition-opacity",
              pageNumber >= numPages && "opacity-40"
            )}
          >
            <span className="sr-only">Next page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 h-8 text-gray-600 dark:text-gray-300"
              >
                <Search className="h-3.5 w-3.5 opacity-50" />
                <span className="text-xs font-medium">{zoom * 100}%</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuItem
                onSelect={() => setZoom(0.5)}
                className="text-xs"
              >
                50%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setZoom(0.75)}
                className="text-xs"
              >
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(1)} className="text-xs">
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setZoom(1.5)}
                className="text-xs"
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(2)} className="text-xs">
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
          >
            <span className="sr-only">Rotate 90 degrees</span>
            <RotateCw className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />
          </Button>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <PDFfullscreen url={url} />
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <SimpleBar className="h-full max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-12rem)]">
          <div
            ref={ref}
            className="flex justify-center bg-gray-100/50 dark:bg-gray-800/50 min-h-full"
          >
            <Document
              file={url}
              className="max-w-full"
              loading={
                <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
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
                  title: "Error Loading PDF",
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
                className="mx-auto shadow-lg rounded-lg bg-white"
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
