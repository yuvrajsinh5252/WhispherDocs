import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatLayout } from "@/components/chatLayout";
import { constructMetadata } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: {
    fileid: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { fileid } = params;

  try {
    const user = await getKindeServerSession().getUser();

    if (!user || !user.id) {
      return constructMetadata({
        title: "Document Chat",
        description: "Chat with your documents using AI",
        noIndex: true,
        canonical: `https://whispher-docs.vercel.app/dashboard/${fileid}`,
      });
    }

    const file = await db.file.findFirst({
      where: {
        id: fileid,
        userId: user.id,
      },
    });

    if (!file) {
      return constructMetadata({
        title: "Document Not Found",
        description: "The requested document could not be found",
        noIndex: true,
        canonical: `https://whispher-docs.vercel.app/dashboard/${fileid}`,
      });
    }

    return constructMetadata({
      title: `Chat with ${file.name}`,
      description: `Chat with your document "${file.name}" using AI to get instant answers and insights.`,
      noIndex: true,
      canonical: `https://whispher-docs.vercel.app/dashboard/${fileid}`,
      type: "article",
      publishedTime: file.createdAt.toISOString(),
    });
  } catch (error) {
    return constructMetadata({
      title: "Document Chat",
      description: "Chat with your documents using AI",
      noIndex: true,
      canonical: `https://whispher-docs.vercel.app/dashboard/${fileid}`,
    });
  }
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
    <div className="flex flex-col h-[calc(100vh-4.05rem)] p-1 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-4 px-1">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Button>
          </Link>
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
            <h1 className="font-medium truncate max-w-[150px] sm:max-w-md text-sm sm:text-base">
              {file.name}
            </h1>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {new Date(file.createdAt).toLocaleDateString()}
        </div>
      </div>
      <ChatLayout file={file} />
    </div>
  );
}
