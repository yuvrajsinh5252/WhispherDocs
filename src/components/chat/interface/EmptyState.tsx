import { MessagesSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-indigo-700/30 flex items-center justify-center mb-5 shadow-md border border-indigo-200/50 dark:border-indigo-700/30 ring-8 ring-indigo-50/20 dark:ring-indigo-900/10">
        <MessagesSquare className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="font-medium text-base text-gray-900 dark:text-gray-100">
        Start conversation
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 max-w-sm leading-relaxed">
        Ask questions about your document
      </p>
    </div>
  );
}
