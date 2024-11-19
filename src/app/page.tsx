import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { FaArrowRight } from "react-icons/fa";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-40 flex flex-col items-center justify-center text-center">
        <div className="dark:text-black max-sm:text-sm my-10 w-40 h-10 flex justify-center items-center shadow-xl rounded-full bg-blue-200">
          WhispherDocs
        </div>
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex flex-col">
            <h1 className="text-4xl max-md:text-xl font-bold">
              Chat with documents.
            </h1>
            <h1 className="text-4xl max-md:text-xl font-bold">
              Get instant answers with cited sources
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <span>
              Get started for free today and see how whispherDocs can help you.
            </span>
            <Button className="font-bold">
              <LoginLink>
                <span className="flex gap-2">
                  Get started
                  <FaArrowRight size={20} />
                </span>
              </LoginLink>
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
