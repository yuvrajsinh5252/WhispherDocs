"use client";

import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "./ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { FaFilePdf } from "react-icons/fa6";
import {
  FileText,
  Loader2,
  MessageSquare,
  Search,
  Trash,
  Upload,
  FileImage,
  FileCode,
  FileArchive,
  SortAsc,
  SortDesc,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import UploadButton from "./UploadButton";
import Link from "next/link";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardComponent = () => {
  const utils = trpc.useUtils();
  const [deletingFile, setDeletingFile] = useState(String);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const [fileSizes, setFileSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!files) return;

    let isMounted = true;
    const abortController = new AbortController();

    files.forEach(async (file) => {
      try {
        const response = await fetch(file.url, {
          method: "HEAD",
          signal: abortController.signal,
        });
        const size = parseInt(response.headers.get("content-length") || "0");

        if (isMounted) {
          setFileSizes((prev) => ({
            ...prev,
            [file.id]: size,
          }));
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching file size:", error);
          if (isMounted) {
            setFileSizes((prev) => ({
              ...prev,
              [file.id]: 0,
            }));
          }
        }
      }
    });

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [files]);

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },

    onMutate({ id }) {
      setDeletingFile(id);
    },

    onSettled() {
      setDeletingFile("");
    },
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="h-5 w-5 text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="h-5 w-5 text-purple-500" />;
      case "zip":
      case "rar":
        return <FileArchive className="h-5 w-5 text-yellow-500" />;
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return <FileCode className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "Size unknown";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const sortFiles = (files: any[]) => {
    return [...files].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "size") {
        comparison = fileSizes[b.id] - fileSizes[a.id];
      }
      return sortOrder === "asc" ? comparison * -1 : comparison;
    });
  };

  const filteredFiles = files
    ? sortFiles(
        files.filter((file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload, manage and chat with your documents
          </p>
        </div>
        <UploadButton />
      </div>

      <div className="flex flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder={sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Files List */}
      {files && files.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-md",
                  deletingFile === file.id && "opacity-60"
                )}
              >
                <Link href={`/dashboard/${file.id}`}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(fileSizes[file.id])}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Chat
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Open in new tab"
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                    </a>

                    <a
                      href={`/api/files/${file.id}/download`}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4 text-gray-500" />
                    </a>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteFile({ id: file.id });
                      }}
                      disabled={deletingFile === file.id}
                    >
                      {deletingFile === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles?.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                No matching documents
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your search query
              </p>
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <Skeleton className="h-6 w-6 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="font-semibold text-xl">No documents yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
            Upload your first document to get started
          </p>
          <UploadButton />
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;
