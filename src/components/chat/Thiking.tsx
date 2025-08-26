export function ThinkingContent({
  content,
  isStreaming,
  shouldShowThinking,
}: {
  content: string;
  isStreaming?: boolean;
  shouldShowThinking?: string | boolean;
}) {
  return (
    <>
      {shouldShowThinking && (
        <div className="mb-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-md p-2 border border-gray-200/30 dark:border-gray-700/30">
             <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap scrollbar-none">
              {content}
              {isStreaming && (
                <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-gray-500 animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
