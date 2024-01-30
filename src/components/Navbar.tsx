import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { LoginLink, LogoutLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ThemeToggle from "./ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaArrowRight } from "react-icons/fa";
import Mobilenav from "./MobileNav";
import { useEffect } from "react";

const Navbar = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    return (
        <nav className="sticky top-0 z-50 dark:bg-gray-800 bg-white shadow-md">
            <MaxWidthWrapper className="flex items-center justify-between p-6 mx-auto dark:text-white text-gray-600 capitalize">
                <div>
                    <Link href="/" className="text-3xl max-sm:text-2xl font-bold">
                        <span>whispherDocs</span>
                    </Link>
                </div>

                <div className="flex gap-2 justify-center items-center">
                    {
                        user ? (
                            <img className="sm:visible lg:hidden rounded-full w-8 h-8 mx-2" src={user?.picture ?? ''} alt="Profile picture" />
                        ) : null
                    }
                    <Mobilenav user={user} />
                </div>

                <div className="max-sm:hidden">
                    <div className="flex justify-around items-center">
                        <Link className={buttonVariants({
                            variant: "ghost",
                        }) + " text-lg"} href="/pricing">
                            home
                        </Link>

                        <Link className={buttonVariants({
                            variant: "ghost",
                        }) + " text-lg"} href="/pricing">
                            pricing
                        </Link>

                        <ThemeToggle />

                        {
                            user ?
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <img className="rounded-full w-10 h-10 mx-2" src={user?.picture ?? ''} alt="Profile picture" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <LogoutLink>
                                                Logout
                                            </LogoutLink>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                :
                                <Button className="mx-2">
                                    <LoginLink className="flex gap-2 font-bold -m-2">
                                        Get started
                                        <FaArrowRight size={20} />
                                    </LoginLink>
                                </Button>
                        }
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}

export default Navbar;