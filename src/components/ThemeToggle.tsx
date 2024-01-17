"use client";

import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle() {
    const [darkmode, setDarkmode] = useState(false);

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            setDarkmode(true);
        }
    }, []);

    useEffect(() => {
        if (darkmode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkmode]);

    return (
        <>
            <div
                className='relative w-16 h-8 dark:bg-gray-800 bg-slate-500 flex items-center cursor-pointer rounded-full p-1 justify-around'
                onClick={() => setDarkmode(!darkmode)}
            >
                <FaMoon className='text-white' size={18} />
                <div
                    className='absolute left-1 w-6 h-6 bg-white rounded-full transition'
                    style={
                        darkmode ? { transform: 'translateX(130%)' } : { transform: 'translateX(0)' }
                    }
                >

                </div>
                <FaSun className='text-white' size={18} />
            </div>

        </>
    );
}