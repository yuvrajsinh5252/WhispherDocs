import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server"
import { MessageValidator } from "@/lib/validator/MessageValidator";
import { db } from "@/db";

export const POST = async (req: NextRequest) => {
    console.log(req.body)

    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) return new Response("Unauthorized", { status: 401 });

    const { fileId, message } = MessageValidator.parse(body);

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId: user?.id,
        },
    });

    if (!file) return new Response("Not Found", { status: 404 });

    await db.messages.create({
        data: {
            text: message,
            isUserMessage: true,
            userId: user?.id,
            fileId: fileId,
        }
    })

}