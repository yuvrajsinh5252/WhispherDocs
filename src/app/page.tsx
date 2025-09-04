"use client";

import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { motion } from "framer-motion";
import {
  FileText,
  MessageCircle,
  Search,
  Upload,
  BookOpen,
  Shield,
  Users,
  Settings,
} from "lucide-react";

import SignInButton from "@/components/signInButton";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 sm:mt-28 mt-16 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 px-4 py-2 flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Intelligence Platform
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col mb-12"
            >
              <h1 className="text-5xl sm:text-6xl max-md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight">
                Your documents deserve
                <span className="text-blue-600 dark:text-blue-400">
                  {" "}
                  smarter conversations
                </span>
              </h1>
              <p className="text-xl max-md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Upload any PDF and start asking questions immediately. Get
                accurate answers with precise citations from your documents in
                seconds.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center items-center"
            >
              <SignInButton />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 w-full max-w-6xl"
        >
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="absolute inset-0">
              <div className="flex w-full h-full">
                {/* PDF Viewer Side */}
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Research Paper.pdf
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        42 pages
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          PDF Document
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Side */}
                <div className="w-3/5 bg-white dark:bg-gray-900 p-4 flex flex-col">
                  <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[85%] border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          What are the main conclusions from this study?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-[85%] border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                          The study concludes that implementing automated
                          document analysis reduces processing time by 73% while
                          maintaining 95% accuracy in information extraction.
                        </p>
                        <div className="text-xs text-blue-700 dark:text-blue-300 pt-2 border-t border-blue-200 dark:border-blue-700">
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Source:</span>
                            <span>Page 38, Abstract & Conclusions</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        placeholder="Ask anything about your document..."
                        className="bg-transparent border-none flex-1 focus:outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
                        disabled
                      />
                      <button
                        disabled
                        className="text-blue-600 dark:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Upload,
              title: "Simple Upload Process",
              description:
                "Drop your PDF files and we'll process them instantly. No complex setup or configuration required.",
            },
            {
              icon: MessageCircle,
              title: "Natural Conversations",
              description:
                'Ask questions in plain English like "What does this contract say about termination?" and get clear, accurate answers.',
            },
            {
              icon: Search,
              title: "Precise Citations",
              description:
                "Every answer includes exact page numbers and section references, so you can verify information quickly.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md h-full flex flex-col"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 w-full max-w-5xl"
        >
          <motion.h2
            className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            Perfect for every use case
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-stretch">
            {[
              {
                icon: Users,
                title: "Research Teams",
                description:
                  "Analyze research papers, extract key findings, and collaborate on literature reviews with precise citations. Perfect for academic and scientific work.",
              },
              {
                icon: Shield,
                title: "Legal & Compliance",
                description:
                  "Review contracts, policies, and regulations efficiently. Find specific clauses and ensure nothing important is missed in legal documents.",
              },
              {
                icon: Settings,
                title: "Multi-Model Selection",
                description:
                  "Choose from different AI models optimized for various document types. Support for multiple languages breaks down global barriers.",
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 flex flex-col h-full"
              >
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg w-fit mb-4">
                  <useCase.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-24 w-full max-w-4xl bg-blue-600 dark:bg-blue-700 rounded-xl p-8 text-center shadow-lg relative overflow-hidden"
        >
          <motion.h2
            className="text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            Ready to transform how you work with documents?
          </motion.h2>
          <motion.p
            className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
          >
            Join thousands of professionals who have already streamlined their
            document workflow. Start asking questions and get answers in
            minutes, not hours.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <SignInButton />
          </motion.div>
        </motion.div>
      </MaxWidthWrapper>
    </>
  );
}
