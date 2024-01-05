import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <MaxWidthWrapper className="flex items-center justify-between p-6 mx-auto text-gray-600 capitalize">
                <div>
                    <Link href="/" className="text-3xl font-bold">
                        <span>whispherDocs</span>
                    </Link>
                </div>

                {/* add mobile navbar later on */}

                <div className="flex justify-around items-center">
                    <Link className={buttonVariants({
                        variant: "ghost",
                        size: 'sm',
                    }) + " text-lg"} href="/pricing">
                        home
                    </Link>
                    <UserButton afterSignOutUrl="/"></UserButton>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}

export default Navbar;