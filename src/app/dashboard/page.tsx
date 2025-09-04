import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import DashboardComponent from "@/components/dashboard";
import { constructMetadata } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Dashboard - Manage Your Documents",
  description:
    "Access and manage your uploaded documents. Chat with your PDFs, view insights, and organize your knowledge base.",
  keywords: [
    "dashboard",
    "document management",
    "PDF dashboard",
    "my documents",
  ],
  canonical: "https://docs.yuvrajsinh.dev/dashboard",
  noIndex: true,
});

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return (
    <MaxWidthWrapper>
      <DashboardComponent />
    </MaxWidthWrapper>
  );
}
