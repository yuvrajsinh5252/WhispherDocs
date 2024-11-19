"use client";

import dynamic from "next/dynamic";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { motion } from "framer-motion";

const SignInButton = dynamic(() => import("@/components/signInButton"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-40 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dark:text-black max-sm:text-sm my-10 w-40 h-10 flex justify-center items-center shadow-xl rounded-full bg-blue-200"
        >
          WhispherDocs
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center items-center gap-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl max-md:text-xl font-bold">
              Chat with documents.
            </h1>
            <h1 className="text-4xl max-md:text-xl font-bold">
              Get instant answers with cited sources
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col justify-center items-center gap-3"
          >
            <span>
              Get started for free today and see how whispherDocs can help you.
            </span>
            {/* Dynamically loaded */}
            <SignInButton />
          </motion.div>
        </motion.div>
      </MaxWidthWrapper>
    </>
  );
}
