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
        "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
        isActive
          ? "text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700"
          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-750"
      )}
    >
      {label}
    </Link>
  );
};

export default NavLink;
