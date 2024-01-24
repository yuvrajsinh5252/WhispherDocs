import Chatwrapper from "@/components/Chatwrapper";
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

    const user  = await getKindeServerSession().getUser();

    if (!user || !user.id) redirect(`/auth-callback?origin=/dashboard/${fileid}`);

    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: user.id,
        },
    });

    if (!file) notFound();

    return (
        <div className="flex h-[calc(100vh-5.5rem)] p-7">
            <div className="flex max-sm:flex-col  justify-between w-full gap-4">
                <div className="border-2 rounded-lg max-sm:h-full w-full overflow-hidden border-zinc-300">
                    <PDFrenderer url={file.url} />
                </div>
                <div className="max-sm:w-full max-sm:border-none border-2 rounded-lg w-9/12 border-zinc-300">
                    <Chatwrapper />
                </div>
            </div>
        </div>
    )
}