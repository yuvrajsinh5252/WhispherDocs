import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function page() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    return (
        <div>
            <h1>{user?.email}</h1>
        </div>
    );
}