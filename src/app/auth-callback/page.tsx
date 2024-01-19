"use client"

import { redirect, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client";

export default function AuthCallBack() {
    const searchParams = useSearchParams();
    const origin = searchParams.get("origin");

    const { data, isLoading}  = trpc.AuthCallback.useQuery(undefined, {
        retry: true,
        retryDelay: 1000,
    });
``
    if (data?.success) {
        redirect(origin ? `/${origin}` : '/dashboard');
    }

    return (
        <div>
            Authenticating user wait a moment...
        </div>
    )
}