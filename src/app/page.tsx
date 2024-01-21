import MaxWidthWrapper from "../components/MaxWidthWrapper"
import { FaArrowRight } from "react-icons/fa"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  if (await isAuthenticated()) redirect("/dashboard");

  return (
    <>
      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className="dark:text-black my-10 w-40 h-10 flex justify-center items-center shadow-xl rounded-full bg-blue-200">
          WhispherDocs
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="flex flex-col gap-3">
            <h1 className='text-4xl max-md:text-2xl font-bold'>Chat with documents.</h1>
            <h1 className='text-4xl max-md:text-2xl font-bold'>Get instant answers with cited sources</h1>
            <div className="flex flex-col justify-center items-center gap-3">
              <span>
                Get started for free today and see how whispherDocs can help you.
              </span>
              <Button className="font-bold">
                <span className="flex gap-2">Get started<FaArrowRight size={20} /></span>
              </Button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>

  )
}