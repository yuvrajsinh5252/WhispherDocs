import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { ERROR_MESSAGES } from "./constants";

export async function authenticateUser(): Promise<{
  user: any;
  error?: Response;
}> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return {
        user: null,
        error: new Response(ERROR_MESSAGES.UNAUTHORIZED, { status: 401 }),
      };
    }

    return { user };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      user: null,
      error: new Response(ERROR_MESSAGES.UNAUTHORIZED, { status: 401 }),
    };
  }
}

export async function validateAndGetFile(
  fileId: string,
  userId: string
): Promise<{ file: any; error?: Response }> {
  try {
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId: userId,
      },
    });

    if (!file) {
      return {
        file: null,
        error: new Response(ERROR_MESSAGES.NOT_FOUND, { status: 404 }),
      };
    }

    return { file };
  } catch (error) {
    console.error("File validation error:", error);
    return {
      file: null,
      error: new Response(ERROR_MESSAGES.NOT_FOUND, { status: 404 }),
    };
  }
}
