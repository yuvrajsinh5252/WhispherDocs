"use client";

import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle() {
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    }

    const [darkmode, setDarkmode] = useState(getInitialTheme());

    useEffect(() => {
        if (darkmode) {
            localStorage.setItem('theme', JSON.stringify(true));
            document.documentElement.classList.add('dark');
        } else {
            localStorage.setItem('theme', JSON.stringify(false));
            document.documentElement.classList.remove('dark');
        }
    }, [darkmode]);

    return (
        <div
            className='relative w-12 h-7 dark:bg-black bg-gray-300 flex items-center cursor-pointer rounded-full p-1 justify-around'
            onClick={() => setDarkmode(!darkmode)}
        >
            <div
                className='absolute left-[2.5px] w-[23px] h-[23px] dark:bg-gray-500 bg-white rounded-full transition flex justify-center items-center'
                style={darkmode ? { transform: 'translateX(80%)' } : { transform: 'translateX(0)' }}
            >
                {darkmode ? <FaMoon className='text-white' size={16} /> : <FaSun className='text-gray-600' size={16} />}
            </div>
        </div>
    );
}