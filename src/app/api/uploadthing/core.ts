import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
    PDFUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const { getUser } =getKindeServerSession();
            const user = await getUser();

            if (!user || !user.id) throw new Error("Unauthorized");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;