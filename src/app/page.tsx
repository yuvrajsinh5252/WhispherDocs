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
  Zap,
} from "lucide-react";
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
            className="mb-6 px-6 py-2.5 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100/50 dark:border-blue-800/50 shadow-sm"
          >
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Powered by AI Technology
            </span>
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
              className="flex flex-col mb-10 relative"
            >
              <h1 className="text-5xl pb-2 sm:text-6xl max-md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-400 dark:to-blue-500 leading-tight">
                Chat with your documents intelligently
              </h1>
              <p className="text-xl max-md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get instant, accurate answers from your PDFs using our advanced
                AI technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md"
            >
              <SignInButton />
              <Button
                variant="outline"
                className="sm:w-auto group border-gray-300 dark:border-gray-700"
              >
                Learn more{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Demo/Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 w-full max-w-5xl"
        >
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="absolute inset-0">
              <div className="flex w-full h-full">
                {/* PDF Preview Side */}
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">document.pdf</span>
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        PDF Preview
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-3/5 bg-white dark:bg-gray-900 p-4 flex flex-col">
                  <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          What is the main topic of this document?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          The main topic is climate change impacts on urban
                          infrastructure, with emphasis on adaptation strategies
                          for city planners.
                        </p>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 border-t border-blue-100 dark:border-blue-800 pt-1">
                          <p className="flex items-center">
                            <span className="font-medium">Citation:</span>
                            <span className="ml-1">
                              Pages 3-4, Section &quot;Introduction to Climate
                              Adaptation&quot;
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                      <input
                        type="text"
                        placeholder="Ask a question about your document..."
                        className="bg-transparent border-none flex-1 focus:outline-none text-sm"
                        disabled
                      />
                      <button
                        disabled
                        className="text-blue-600 dark:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </button>
                    </div>
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
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow group">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Upload Your Documents</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Easily upload your PDFs and let our system analyze and index them
              for quick retrieval.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow group">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Chat Naturally</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Ask questions in natural language and receive accurate answers
              from your documents.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow group">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Cited Sources</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
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
          className="mt-24 w-full max-w-4xl bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
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
                  "Get the answers directly from the document, reducing the risk of errors.",
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
              <div key={i} className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
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
          className="mt-24 w-full max-w-3xl bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

          <h2 className="text-3xl font-bold mb-4 text-white relative z-10">
            Ready to chat with your documents?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto relative z-10">
            Get started for free today and see how WhispherDocs can help you
            extract insights from your PDFs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <SignInButton />
            <UploadButton />
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </>
  );
}
