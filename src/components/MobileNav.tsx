"use client";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  user: any;
}

export default function Mobilenav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl border border-gray-200/70 dark:border-gray-800/70 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 backdrop-blur-sm transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-80 p-0 border-l border-gray-200/70 dark:border-gray-800/70 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200/70 dark:border-gray-800/70">
            <SheetHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 dark:shadow-indigo-400/20">
                    <span className="text-white font-bold text-xl">W</span>
                  </div>
                  <SheetTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-800 dark:from-white dark:via-indigo-200 dark:to-gray-200 bg-clip-text text-transparent">
                    WhispherDocs
                  </SheetTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
            </SheetHeader>

            {user && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-indigo-200/50 dark:ring-indigo-500/30">
                  <Image
                    src={
                      user.picture || "https://example.com/default-profile.png"
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.given_name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl p-3 transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-100/70 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 border border-transparent"
                      )}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300",
                          isActive
                            ? "bg-white dark:bg-gray-800 shadow-md shadow-indigo-500/10 dark:shadow-indigo-400/10"
                            : "bg-gray-100/60 dark:bg-gray-800/60 group-hover:bg-white dark:group-hover:bg-gray-700"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400"
                              : ""
                          )}
                        />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                {user && (
                  <Link
                    href="/dashboard/upload"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl p-3 transition-all duration-300",
                      pathname?.startsWith("/dashboard/upload")
                        ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-100/70 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300",
                        pathname?.startsWith("/dashboard/upload")
                          ? "bg-white dark:bg-gray-800 shadow-md shadow-indigo-500/10 dark:shadow-indigo-400/10"
                          : "bg-gray-100/60 dark:bg-gray-800/60 group-hover:bg-white dark:group-hover:bg-gray-700"
                      )}
                    >
                      <Upload
                        className={cn(
                          "h-5 w-5",
                          pathname?.startsWith("/dashboard/upload")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : ""
                        )}
                      />
                    </div>
                    <span className="font-medium">Upload PDF</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200/70 dark:border-gray-800/70">
            {user ? (
              <LogoutLink>
                <Button
                  variant="destructive"
                  className="w-full gap-2 h-11 rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log out</span>
                </Button>
              </LogoutLink>
            ) : (
              <LoginLink>
                <Button className="w-full gap-2 h-11 rounded-xl font-medium bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-500 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
                  <LogIn className="h-5 w-5" />
                  <span>Sign in</span>
                </Button>
              </LoginLink>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
