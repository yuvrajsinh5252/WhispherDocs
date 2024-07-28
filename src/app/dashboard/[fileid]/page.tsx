import Chatwrapper from "@/components/chat/Chatwrapper";
import PDFrenderer from "@/components/PDFrenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
    params: {
        fileid: string
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
        <div className="flex h-[calc(100vh-5.5rem)] p-7 max-sm:p-2">
            <div className="flex max-sm:flex-col  justify-between w-full gap-4 max-sm:gap-1">
                <div className="border-2 rounded-lg max-sm:h-full w-full overflow-y-scroll overflow-x-scroll no-scrollbar border-zinc-300 dark:max-sm:border-gray-600 min-h-[3.7rem]">
                    <PDFrenderer url={file.url} />
                </div>
                <div className="max-sm:w-full border-2 rounded-lg w-9/12 border-zinc-300 dark:max-sm:border-gray-600">
                    <Chatwrapper fileId={file.id} />
                </div>
            </div>
        </div>
    )
}