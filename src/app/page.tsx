"use client";

import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  MessageCircle,
  Search,
  Upload,
  Zap,
  LucideSettings,
  Brain,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import SignInButton from "@/components/signInButton";
import UploadButton from "@/components/UploadButton";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 sm:mt-28 mt-16 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 600,
              damping: 30,
            }}
            className="mb-6 px-6 py-2.5 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100/50 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Powered by AI Technology
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col justify-center items-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex flex-col mb-10 relative"
            >
              <motion.h1
                className="text-5xl pb-2 sm:text-6xl max-md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-400 dark:to-blue-500 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                Chat with your documents intelligently
              </motion.h1>
              <motion.p
                className="text-xl max-md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                Turn your PDFs into an instant knowledge base. Ask questions,
                get precise answers with citations in seconds.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md"
            >
              <div>
                <SignInButton />
              </div>
              <div>
                <Button
                  variant="outline"
                  className="sm:w-auto group border-gray-300 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-200"
                >
                  Learn more{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-20 w-full max-w-5xl"
        >
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="absolute inset-0">
              <div className="flex w-full h-full">
                <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">
                      medication_guide.pdf
                    </span>
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
                          What&apos;s the recommended dosage for patients over
                          65?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          For patients over 65, the recommended starting dosage
                          is 25mg once daily, with potential adjustment based on
                          kidney function and concurrent medications. Monitor
                          for side effects during the first two weeks.
                        </p>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 border-t border-blue-100 dark:border-blue-800 pt-1">
                          <p className="flex items-center">
                            <span className="font-medium">Citation:</span>
                            <span className="ml-1">
                              Page 12, Section 4.2 &quot;Geriatric
                              Considerations&quot;
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Upload,
              color: "blue",
              title: "Upload Your Documents",
              description:
                "Drag & drop PDFs, research papers, manuals, or any document. Our AI processes them instantly, understanding context and relationships between sections.",
              delay: 0.1,
            },
            {
              icon: MessageCircle,
              color: "green",
              title: "Chat Naturally",
              description:
                'Ask complex questions like "summarize the key findings" or "what are the implications for X?" Get answers that understand nuance and context.',
              delay: 0.2,
            },
            {
              icon: Search,
              color: "purple",
              title: "Source Citations",
              description:
                "Every answer comes with precise citations: page numbers, sections, and direct quotes. Perfect for research, compliance, and fact-checking.",
              delay: 0.3,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-xl w-fit mb-4 transition-transform duration-200`}
              >
                <feature.icon
                  className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`}
                />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-24 w-full max-w-4xl bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <motion.h2
            className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Why Choose WhispherDocs?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Save Hours Daily",
                description:
                  "Stop scrolling through 50-page PDFs. Ask once, get the exact information you need in seconds.",
                delay: 0.1,
              },
              {
                title: "Never Miss Important Details",
                description:
                  "Our AI reads every word and understands context, so you get complete answers, not just keyword matches.",
                delay: 0.2,
              },
              {
                title: "Your Knowledge Hub",
                description:
                  "Turn scattered documents into a unified knowledge base. Everything stays organized and instantly searchable.",
                delay: 0.3,
              },
              {
                title: "Works Out of the Box",
                description:
                  "No setup required. Upload any PDF and start asking questions immediately. Seriously, it&apos;s that simple.",
                delay: 0.4,
              },
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20 transition-transform duration-200">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-16 w-full max-w-5xl"
        >
          <motion.h2
            className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.45,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Advanced AI Capabilities
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: LucideSettings,
                color: "indigo",
                title: "Model Selection",
                description:
                  "Choose from multiple AI models optimized for different document types and analysis needs.",
                delay: 0.1,
              },
              {
                icon: Brain,
                color: "pink",
                title: "Reasoning Models",
                description:
                  "Advanced reasoning capabilities for complex document analysis, inference, and logical connections.",
                delay: 0.2,
              },
              {
                icon: Globe,
                color: "emerald",
                title: "Multilingual Support",
                description:
                  "Chat with documents in multiple languages, breaking down language barriers for global accessibility.",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-xl w-fit mb-4 transition-transform duration-200`}
                >
                  <feature.icon
                    className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`}
                  />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-24 w-full max-w-3xl bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

          <motion.h2
            className="text-3xl font-bold mb-4 text-white relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Join thousands who&apos;ve transformed their workflow
          </motion.h2>
          <motion.p
            className="text-indigo-100 mb-8 max-w-xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.65,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Stop wasting time searching. Start getting answers. Upload your
            first document and experience the difference in minutes.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <div>
              <SignInButton />
            </div>
            <div>
              <UploadButton />
            </div>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </>
  );
}
