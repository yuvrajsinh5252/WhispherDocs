import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
const isAuth = t.middleware(async (opts) => {
    const user = await getKindeServerSession().getUser();

    return opts.next({
        ctx: {
            userId: user?.id,
            user,
        }
    });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);