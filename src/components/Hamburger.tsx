"use client"

import { useState } from "react";

export default function Hamburger() {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden xl:hidden sm:hidden">
            <div className="flex justify-around flex-col gap-1 w-10" onClick={() => { setOpen(!open) }}>
                <div className="h-1 w-8 z-10 bg-black transition"
                    style={
                        !open ? { transform: 'rotate(-45deg)', width: '1.68rem' } : { transform: 'rotate(0)' }
                    }
                ></div>
                <div className="h-1 w-8 z-10 bg-black transition"
                    style={
                        !open ? { transform: 'translateX(15%)', width: '2.25rem' } : { transform: 'translateX(0)' }
                    }
                ></div>
                <div className="h-1 w-8 z-10 bg-black transition"
                    style={
                        !open ? { transform: 'rotate(45deg)', width: '1.68rem' } : { transform: 'rotate(0)' }
                    }
                ></div>
            </div>

            <div className="absolute h-screen w-56 items-center flex flex-col gap-4 bg-slate-200 py-20 top-0 translate-x-96 px-2 transition"
                style={
                    open ? { transform: 'translateX(100%)'} : { transform: 'translateX(-70%)'}
                }
            >
                <a href="/" className="text-gray-400 font-bold">Home</a>
                <a href="/about" className="text-gray-400 font-bold">About</a>
                <a href="/contact" className="text-gray-400 font-bold">Contact</a>
            </div>
        </div>
    );
}