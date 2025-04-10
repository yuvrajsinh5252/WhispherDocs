"use client";

import { trpc } from "@/app/_trpc/client";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import {
  FileText,
  Ghost,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Trash,
  Upload,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import UploadButton from "./UploadButton";
import Link from "next/link";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const DashboardComponent = () => {
  const utils = trpc.useUtils();
  const [deletingFile, setDeletingFile] = useState(String);
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setTheme("dark");
  }, []);

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
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

  // Filter files based on search query
  const filteredFiles = files?.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload, manage and chat with your documents
          </p>
        </div>
        <UploadButton />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
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

      {/* Files List */}
      {files && files.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles?.map((file) => (
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
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded on{" "}
                        {format(new Date(file.createdAt), "MMM d, yyyy")}
                      </p>
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
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
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
                <div className="p-4">
                  <Skeleton height={24} width={180} />
                  <Skeleton height={16} width={120} className="mt-2" />
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton height={18} width={80} />
                    <Skeleton height={24} width={60} />
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
