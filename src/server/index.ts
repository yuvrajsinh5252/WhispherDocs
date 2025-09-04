import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infiinte-querry";

export const appRouter = router({
  AuthCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: adminProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),

  getFileUploadStatus: adminProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFile: adminProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return file;
    }),

  deleteFile: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),

  getMessages: adminProcedure
    .input(
      z.object({
        fileId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const messages = await db.messages.findMany({
        take: limit + 1,
        where: {
          fileId: file.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          text: true,
          createdAt: true,
          isUserMessage: true,
          thinking: true, // Include thinking content directly
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem!.id;
      }

      return { messages, nextCursor };
    }),

  getMessageThinking: adminProcedure
    .input(z.object({ messageId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { messageId } = input;

      const message = await db.messages.findFirst({
        where: {
          id: messageId,
          userId,
        },
        select: {
          thinking: true,
        },
      });

      if (!message) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return { thinking: message.thinking };
    }),
});

export type AppRouter = typeof appRouter;
