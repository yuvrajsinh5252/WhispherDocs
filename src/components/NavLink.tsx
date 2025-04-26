"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
        isActive
          ? "text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      )}
    >
      {label}
    </Link>
  );
};

export default NavLink;
