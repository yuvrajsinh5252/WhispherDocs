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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/95 dark:bg-gray-950/95 border-b border-gray-200 dark:border-gray-800">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-all hover:opacity-80 duration-200"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="hidden sm:inline-block text-xl font-bold text-gray-900 dark:text-white">
              WhispherDocs
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <NavLink href="/" label="Home" />
                <NavLink href="/dashboard" label="Dashboard" />
              </div>
              <ModeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-9 w-9 rounded-lg overflow-hidden outline-none ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200">
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
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  >
                    <DropdownMenuLabel className="flex items-center gap-3 p-2 rounded-md">
                      <div className="h-8 w-8 rounded-md overflow-hidden relative">
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
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      asChild
                      className="p-2 rounded-md focus:bg-gray-100 dark:focus:bg-gray-800"
                    >
                      <LogoutLink className="w-full cursor-pointer">
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Log out
                        </span>
                      </LogoutLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 transition-colors">
                  <LoginLink className="flex items-center gap-2">
                    Get started
                    <FaArrowRight className="h-4 w-4" />
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
