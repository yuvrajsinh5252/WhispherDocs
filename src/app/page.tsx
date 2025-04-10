"use client";

import dynamic from "next/dynamic";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  MessageCircle,
  Search,
  Star,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SignInButton = dynamic(() => import("@/components/signInButton"), {
  ssr: false,
});

const UploadButton = dynamic(() => import("@/components/UploadButton"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 sm:mt-28 mt-16 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dark:text-black mb-6 px-5 py-2 flex justify-center items-center shadow-xl rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800"
          >
            <span className="font-medium">✨ WhispherDocs</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center items-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-col mb-10"
            >
              <h1 className="text-5xl max-md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-700 dark:from-indigo-400 dark:to-blue-500">
                Chat with your documents
              </h1>
              <p className="text-xl max-md:text-lg text-gray-600 dark:text-gray-300">
                Get instant answers with cited sources from your PDFs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md"
            >
              <SignInButton />
              <Button variant="outline" className="w-full sm:w-auto group">
                Learn more{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex items-center gap-x-8 mt-12"
        >
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 ${
                  [
                    "bg-indigo-400",
                    "bg-blue-400",
                    "bg-green-400",
                    "bg-purple-400",
                  ][i]
                } flex items-center justify-center text-white text-xs font-medium`}
              >
                {["A", "B", "C", "D"][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              from 500+ users
            </span>
          </div>
        </motion.div>

        {/* Demo/Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 w-full max-w-5xl"
        >
          <div className="relative w-full h-[350px] sm:h-[450px] rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="absolute inset-0">
              <div className="flex w-full h-full">
                {/* PDF Preview Side */}
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">document.pdf</span>
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">PDF Preview</span>
                    </div>
                  </div>
                </div>

                {/* Chat Interface Side */}
                <div className="w-3/5 bg-white dark:bg-gray-900 p-4 flex flex-col">
                  <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          How many pages does this document have?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          The document has 24 pages in total.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Source: Page 1
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          What is the main topic of this document?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Ask a question about your document..."
                      className="bg-transparent border-none flex-1 focus:outline-none text-sm"
                      disabled
                    />
                    <button disabled className="text-indigo-500">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit mb-4">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Upload Your Documents</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Easily upload your PDFs and let our system analyze and index them
              for quick retrieval.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mb-4">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Chat Naturally</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Ask questions in natural language and receive accurate answers
              from your documents.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit mb-4">
              <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Cited Sources</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Every answer includes citations to the source material, so you
              know exactly where the information comes from.
            </p>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-24 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Why Choose WhispherDocs?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Save Time",
                description:
                  "Get answers in seconds instead of reading through entire documents.",
              },
              {
                title: "Improve Accuracy",
                description:
                  "AI-powered search with source citations ensures reliable information.",
              },
              {
                title: "Better Organization",
                description:
                  "Keep all your important documents in one searchable place.",
              },
              {
                title: "Seamless Experience",
                description:
                  "Upload and start chatting with your documents in minutes.",
              },
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-20 w-full max-w-3xl bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 rounded-2xl p-8 text-center shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to chat with your documents?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            Get started for free today and see how WhispherDocs can help you
            extract insights from your PDFs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton />
            <UploadButton />
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </>
  );
}
