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

interface MobileNavProps {
  user: any;
}

export default function Mobilenav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <SheetHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">W</span>
                  </div>
                  <SheetTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    WhispherDocs
                  </SheetTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
            </SheetHeader>

            {user && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
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
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                {user && (
                  <Link
                    href="/dashboard/upload"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Upload PDF</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-800">
            {user ? (
              <LogoutLink>
                <Button variant="destructive" className="w-full gap-2 h-11">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </Button>
              </LogoutLink>
            ) : (
              <LoginLink>
                <Button className="w-full gap-2 h-11 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Sign in</span>
                </Button>
              </LoginLink>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
