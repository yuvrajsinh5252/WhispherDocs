"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/app/_trpc/client";

const providers = ({ children }: PropsWithChildren<{}>) => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClent] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "https://localhost:3000/api/trpc",
                }),
            ],
        })
    )

    return (
        <trpc.Provider client={trpcClent} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
};

export default providers;
