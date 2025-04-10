import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  LoginLink,
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { FaArrowRight } from "react-icons/fa";
import Mobilenav from "./MobileNav";
import { ModeToggle } from "./theme/theme-toggle";
import { cn } from "@/lib/utils";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const image_url = user?.picture || "https://example.com/default-profile.png";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="hidden sm:inline-block text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              WhispherDocs
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hidden sm:flex"
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-sm font-medium transition-colors hidden sm:flex"
                  )}
                >
                  Dashboard
                </Link>
              </div>
              <ModeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-9 w-9 rounded-full overflow-hidden outline-none ring-2 ring-gray-200 dark:ring-gray-800 transition hover:ring-gray-300 dark:hover:ring-gray-700">
                      <Image
                        src={image_url}
                        alt="Profile picture"
                        fill
                        className="object-cover"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden relative">
                        <Image
                          src={image_url}
                          alt="Profile picture"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.given_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LogoutLink className="w-full cursor-pointer">
                        <span className="text-red-600 dark:text-red-400">
                          Log out
                        </span>
                      </LogoutLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-200">
                  <LoginLink className="flex items-center gap-2">
                    Get started
                    <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </LoginLink>
                </Button>
              )}
            </div>

            <div className="sm:hidden">
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Mobilenav user={user} />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
