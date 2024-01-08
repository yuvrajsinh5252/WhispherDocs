import { AppRouter } from "@/trpc";
import { createReactQueryHooks } from "@trpc/react-query";

export const trpc = createReactQueryHooks<AppRouter>();
