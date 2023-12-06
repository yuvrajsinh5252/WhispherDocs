import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

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
                    <div>
                        <Link className={buttonVariants({
                            variant: "ghost",
                            size: 'sm',
                        }) + " text-lg"} href="/pricing">
                            home
                        </Link>
                        <LoginLink className={buttonVariants({
                            variant: "ghost",
                            size: 'sm',
                        })}>
                            Sign in
                        </LoginLink>
                        <RegisterLink className={buttonVariants({
                            size: 'sm',
                        })}>
                            Get Started <ArrowRight className="ml-1.5 h-5 w-5" />
                        </RegisterLink>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}

export default Navbar;