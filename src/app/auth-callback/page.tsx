"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client";

export default function AuthCallBack() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const origin = searchParams.get("origin");

    const { data, isLoading}  = trpc.AuthCallback.useQuery(undefined, {
        retry: true,
        retryDelay: 1000,
    });

    if (data?.success) {
        router.push(origin ? `/${origin}` : '/dashboard');
    }

    console.log(data?.success);

    return <div>Setting up the database....</div>
}