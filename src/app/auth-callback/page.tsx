"use client";

import { redirect, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Suspense } from "react";
import { constructMetadata } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Authenticating",
  description: "Please wait while we authenticate your account.",
  noIndex: true,
});

export default function AuthCallBack() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallBackContent />
    </Suspense>
  );
}

function AuthCallBackContent() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data } = trpc.AuthCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 1000,
  });

  if (data?.success) {
    redirect(origin ? `/${origin}` : "/dashboard");
  }

  return <div>Authenticating user wait a moment...</div>;
}
