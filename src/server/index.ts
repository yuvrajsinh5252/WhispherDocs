import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { adminProcedure, publicProcedure, router } from './trpc';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';

export const appRouter = router({
    AuthCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user?.id || !user?.email) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
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

    getFile: adminProcedure.input(
            z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;
            const file = await db.file.findFirst({
                where: {
                    id: input.key,
                    userId,
                },
            });

            if (!file) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return file;
        }
        ),

    deleteFile: adminProcedure.input(
        z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        const file = await db.file.findFirst({
            where: {
                id: input.id,
                userId,
            },
        });

        if (!file) {
            throw new TRPCError({ code: 'NOT_FOUND' });
        }

        await db.file.delete({
            where: {
                id: input.id,
            },
        });

        return file;
    }),
});

export type AppRouter = typeof appRouter;