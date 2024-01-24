import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import DashboardComponent from "../../components/dashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

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