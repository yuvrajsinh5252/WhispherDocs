import { buttonVariants } from "@/components/ui/button"
import MaxWidthWrapper from "../components/MaxWidthWrapper"
import { FaArrowRight } from "react-icons/fa"

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="flex flex-col gap-3">
            <h1 className='text-4xl max-md:text-2xl font-bold'>Chat with documents.</h1>
            <h1 className='text-4xl max-md:text-2xl font-bold'>Get instant answers with cited sources</h1>
            <div className="flex justify-center items-center gap-3">
              <span>Try now</span>
              <button
                className={"text-lg" +
                buttonVariants({
                  variant: "default",
                })}
              >
                <span className="flex gap-2">Get started<FaArrowRight size={20} /></span>
              </button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>

  )
}