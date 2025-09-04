"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  return (
    <Button
      variant="outline"
      className="bg-white text-blue-600 border-white hover:bg-blue-50 hover:text-blue-700 font-medium"
    >
      <LoginLink>
        <span className="flex items-center gap-2">
          Get started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </LoginLink>
    </Button>
  );
}
