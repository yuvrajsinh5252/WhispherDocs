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
import { FaArrowRight } from "react-icons/fa";
import Mobilenav from "./MobileNav";
import { ModeToggle } from "./theme/theme-toggle";
import NavLink from "./NavLink";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const image_url = user?.picture || "https://example.com/default-profile.png";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] duration-200"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 dark:shadow-indigo-400/20">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="hidden sm:inline-block text-xl font-semibold bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-800 dark:from-white dark:via-indigo-200 dark:to-gray-200 bg-clip-text text-transparent">
              WhispherDocs
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center  bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                <NavLink href="/" label="Home" />
                <NavLink href="/dashboard" label="Dashboard" />
              </div>
              <ModeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-10 w-10 rounded-full overflow-hidden outline-none ring-2 ring-indigo-200/50 dark:ring-indigo-500/30 transition duration-300 hover:ring-indigo-300 dark:hover:ring-indigo-400 shadow-sm hover:shadow-md hover:shadow-indigo-300/10 dark:hover:shadow-indigo-400/10">
                      <Image
                        src={image_url}
                        alt="Profile picture"
                        fill
                        className="object-cover"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="p-1.5 rounded-xl shadow-lg border-gray-200/70 dark:border-gray-700/70 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"
                  >
                    <DropdownMenuLabel className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-800/60">
                      <div className="h-10 w-10 rounded-full overflow-hidden relative ring-2 ring-indigo-200/50 dark:ring-indigo-500/30">
                        <Image
                          src={image_url}
                          alt="Profile picture"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {user.given_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-gray-200/70 dark:bg-gray-700/70" />
                    <DropdownMenuItem
                      asChild
                      className="p-2.5 rounded-lg transition-all duration-200 focus:bg-gray-100/60 dark:focus:bg-gray-800/60"
                    >
                      <LogoutLink className="w-full cursor-pointer">
                        <span className="text-red-500 dark:text-red-400 font-medium flex items-center justify-center gap-2">
                          Log out
                        </span>
                      </LogoutLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 rounded-xl px-5">
                  <LoginLink className="flex items-center gap-2">
                    Get started
                    <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </LoginLink>
                </Button>
              )}
            </div>

            <div className="sm:hidden">
              <div className="flex items-center gap-3">
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
