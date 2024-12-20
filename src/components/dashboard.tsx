"use client";

import { trpc } from "@/app/_trpc/client";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { format } from "date-fns";
import {
  FileText,
  Ghost,
  Loader2,
  MessageSquareCode,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import UploadButton from "./UploadButton";
import Link from "next/link";

const DashboardComponent = () => {
  const utils = trpc.useUtils();
  const [deletingFile, setDeletingFile] = useState(String);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setTheme("dark");
  }, []);

  const { data: file, isLoading } = trpc.getUserFiles.useQuery();
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

  return (
    <div className="divide-y-2 max-sm:mt-0 mt-10">
      <div className="flex max-sm:justify-around max-sm:px-0 justify-between px-8 py-8 items-center">
        <h1 className="text-[20px] font-bold max-sm:text-xl">My Files</h1>
        <UploadButton />
      </div>
      <div className="h-[calc(100vh-15.25rem)] flex gap-2 justify-center">
        {file && file.length != 0 ? (
          <div className="w-full">
            <div className="flex flex-wrap gap-8 max-sm:justify-around justify-normal py-5">
              {file.map((item, index) => (
                <div
                  key={index}
                  className="border dark:border-none shadow dark:bg-gray-900 hover:shadow-lg rounded-lg w-[350px] max-sm:w-[300px]"
                >
                  <div className="divide-y divide-gray-200 dark:divide-gray-600 p-1">
                    <Link href={`/dashboard/${item.id}`}>
                      <div className="flex items-center px-6 gap-5 justify-start h-[82px]">
                        <FileText />
                        <div className="w-[250px] text-sm truncate">
                          {item.name}
                        </div>
                      </div>
                    </Link>
                    <div className="flex justify-around text-gray-600 dark:text-gray-300 gap-10 w-full p-2">
                      <span className="flex items-center gap-2 text-xs">
                        <div>
                          <Plus size={15} />
                        </div>
                        {format(new Date(item.createdAt), "MMM yyyy")}
                      </span>
                      <span className="text-xs">
                        <a
                          className="flex items-center pt-1 gap-2 text-xs w-[95px] truncate"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div>
                            <MessageSquareCode size={20} />
                          </div>
                          <div className="flex">{item.name}</div>
                        </a>
                      </span>
                      <Button
                        size="default"
                        variant="destructive"
                        onClick={() => {
                          deleteFile({ id: item.id });
                        }}
                      >
                        {deletingFile === item.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          <SkeletonTheme
            {...{
              baseColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
              highlightColor: theme === "dark" ? "#374151" : "#E5E7EB",
            }}
          >
            <Skeleton
              style={{
                display: "flex",
                marginTop: "1.5rem",
                width: "58vw",
                height: "10vh",

                minWidth: "350px",
              }}
              count={4}
            />
          </SkeletonTheme>
        ) : (
          <div className="m-auto">
            <h1 className="m-auto flex items-center flex-col gap-3 text-lg">
              <Ghost />
              No files uploaded yet
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
