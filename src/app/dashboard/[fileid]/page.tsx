import Chatwrapper from "@/components/chat/Chatwrapper";
import PDFrenderer from "@/components/PDFrenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    fileid: string;
  };
}

export default async function page({ params }: PageProps) {
  const { fileid } = params;

  const user = await getKindeServerSession().getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=/dashboard/${fileid}`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 max-sm:p-2">
      {/* Breadcrumb and file info bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-blue-500 mr-2" />
            <h1 className="font-medium truncate max-w-[200px] sm:max-w-md">
              {file.name}
            </h1>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
          {new Date(file.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Main content area with PDF and chat */}
      <div className="flex flex-1 max-sm:flex-col justify-between w-full gap-4 max-sm:gap-2 h-[calc(100%-2rem)]">
        {/* PDF container */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-1 overflow-hidden flex flex-col max-sm:h-[45%]">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <FileText className="h-4 w-4 text-blue-500 mr-2" />
            <span className="font-medium text-sm">Document Viewer</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <PDFrenderer url={file.url} />
          </div>
        </div>

        {/* Chat container */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-[40%] max-sm:w-full max-sm:h-[55%] flex flex-col">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
            <span className="font-medium text-sm">Chat with Document</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chatwrapper fileId={file.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
