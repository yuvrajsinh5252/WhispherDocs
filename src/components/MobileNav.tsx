"use client"

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./theme/theme-toggle";

export default function Mobilenav(user: any) {
    const [open, setOpen] = useState(true);

    return (
        <div className="lg:hidden xl:hidden sm:hidden">
            <div className="flex justify-around flex-col gap-1 w-10" onClick={() => { setOpen(!open) }}>
                <div className="h-1 w-8 z-10 dark:bg-white bg-black transition"
                    style={
                        !open ? { transform: 'rotate(-45deg)', width: '1.68rem' } : { transform: 'rotate(0)' }
                    }
                ></div>
                <div className="h-1 w-8 z-10 dark:bg-white bg-black transition"
                    style={
                        !open ? { transform: 'translateX(15%)', width: '2.25rem' } : { transform: 'translateX(0)' }
                    }
                ></div>
                <div className="h-1 w-8 z-10 dark:bg-white bg-black transition"
                    style={
                        !open ? { transform: 'rotate(45deg)', width: '1.68rem' } : { transform: 'rotate(0)' }
                    }
                ></div>
            </div>

            <div className="fixed w-full h-screen dark:bg-gray-900 bg-white top-0 left-0 z-0 transition"
                style={
                    !open ? { transform: 'translateX(0)' } : { transform: 'translateX(100%)' }
                }
            >
                <div className="flex flex-col justify-center items-center gap-4 h-full">
                    <ModeToggle />
                    <Link className="text-[16.5px]" href="/pricing">
                        home
                    </Link>

                    <Link className="text-[16.5px]" href="/pricing">
                        pricing
                    </Link>
                    {
                        user.user ?
                            <LogoutLink>
                                Logout
                            </LogoutLink>
                            :
                            <LoginLink>
                                sign in
                            </LoginLink>
                    }
                </div>
            </div>
        </div>
    );
}