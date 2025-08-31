export function LoadingDots({
  className = "bg-indigo-500",
  size = "md",
  label = "Thinking",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "h-1.5 w-1.5"
      : size === "lg"
      ? "h-3.5 w-3.5"
      : "h-2.5 w-2.5";

  return (
    <div
      className="flex items-center gap-1.5 py-0.5"
      role="status"
      aria-live="polite"
      aria-label={`${label}…`}
    >
      <div
        className={`${sizeClass} ${className} rounded-full shadow-sm animate-[pulse_1.2s_ease-in-out_0ms_infinite]`}
      />
      <div
        className={`${sizeClass} ${className} rounded-full shadow-sm animate-[pulse_1.2s_ease-in-out_200ms_infinite]`}
      />
      <div
        className={`${sizeClass} ${className} rounded-full shadow-sm animate-[pulse_1.2s_ease-in-out_400ms_infinite]`}
      />
    </div>
  );
}

export function ThinkingContent({
  content,
  isStreaming,
  shouldShowThinking,
}: {
  content: string;
  isStreaming?: boolean;
  shouldShowThinking?: string | boolean;
}) {
  if (!shouldShowThinking) return null;

  return (
    <div className="pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="relative rounded-md p-2 border bg-gradient-to-br from-gray-50/80 to-white/40 dark:from-gray-800/40 dark:to-gray-900/30 border-gray-200/40 dark:border-gray-700/40">
        <div className="absolute inset-0 rounded-md pointer-events-none [mask-image:radial-gradient(200px_80px_at_10%_10%,_black,_transparent)]">
          <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 blur" />
        </div>
        <div className="relative text-xs text-gray-700 dark:text-gray-300 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap scrollbar-none">
          {content}
          {isStreaming && (
            <span className="ml-1 align-middle">
              <LoadingDots
                className="bg-gray-400 dark:bg-gray-500"
                size="sm"
                label="Streaming reasoning"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
