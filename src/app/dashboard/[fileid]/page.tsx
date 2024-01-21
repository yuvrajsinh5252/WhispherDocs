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
        <div className="flex h-[calc(100vh-5.5rem)] p-4">
            <div className="lg:flex rounded-lg justify-between p-2 shadow-xl w-full gap-2">
                <div className="rounded-sm lg:w-[55vw] lg:h-full sm:h-[50%] bg-yellow-300 flex justify-center items-center">
                    <PDFrenderer />
                </div>
                <div className="rounded-sm lg:w-[45vw] lg:h-full sm:h-[50%] bg-green-300 flex justify-center items-center">
                    <Chatwrapper />
                </div>
            </div>
        </div>
    )
}