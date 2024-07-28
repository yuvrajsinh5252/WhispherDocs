import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Img from "next/image";
import { Button } from "./ui/button";
import { LoginLink, LogoutLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { FaArrowRight } from "react-icons/fa";
import Mobilenav from "./MobileNav";
import { ModeToggle } from "./theme/theme-toggle";

const Navbar = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const image_url = user?.picture || 'https://example.com/default-profile.png';

    return (
        <nav className="sticky top-0 z-50 shadow-md dark:bg-slate-900">
            <MaxWidthWrapper className="flex items-center justify-between p-3 mx-auto capitalize">
                <div>
                    <Link href="/" className="text-2xl max-sm:text-2xl font-bold">
                        <span>whispherDocs</span>
                    </Link>
                </div>

                <div className="flex gap-2 justify-center items-center">
                    {
                        user ? (
                            <Img className="sm:visible lg:hidden rounded-full mx-2"
                                width={30}
                                height={30}
                                src={image_url}
                                alt="Profile picture"
                            />
                        ) : null
                    }
                    <Mobilenav user={user} />
                </div>

                <div className="max-sm:hidden">
                    <div className="flex justify-around items-center divide-x-2">
                        <div className="flex gap-2 pr-2">
                            <Link className={navigationMenuTriggerStyle()} href="/pricing">home</Link>
                            <Link className={navigationMenuTriggerStyle()} href="/pricing">pricing</Link>
                        </div>
                        <div className="pl-2 flex justify-center items-center">
                            <ModeToggle />
                            {
                                user ?
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Img className="rounded-full mx-2"
                                                width={35}
                                                height={35}
                                                src={image_url}
                                                alt="Profile picture"
                                            />
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
                </div>
            </MaxWidthWrapper>
        </nav >
    );
}

export default Navbar;