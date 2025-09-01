import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col mt-10 h-full gap-4 p-4 sm:p-6 animate-in fade-in duration-500">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 ${
              i % 2 === 0 ? "" : "justify-end"
            }`}
          >
            <div
              className={`flex gap-3 ${
                i % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {i % 2 === 0 && (
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-indigo-700/20 shadow-sm border border-indigo-200/50 dark:border-indigo-700/30">
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              )}
              <div
                className={`flex flex-col gap-2 ${
                  i % 2 === 0 ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 max-w-md backdrop-blur-sm shadow-md ${
                    i % 2 === 0
                      ? "bg-white/90 dark:bg-gray-800/70 border border-gray-100/50 dark:border-gray-700/50"
                      : "bg-gradient-to-br from-indigo-500/90 to-violet-600/90 border border-white/10"
                  }`}
                >
                  <div className="space-y-2.5">
                    <Skeleton
                      className={`h-4 w-[250px] ${
                        i % 2 === 1 ? "bg-white/30" : ""
                      }`}
                    />
                    <Skeleton
                      className={`h-4 w-[200px] ${
                        i % 2 === 1 ? "bg-white/30" : ""
                      }`}
                    />
                    <Skeleton
                      className={`h-4 w-[150px] ${
                        i % 2 === 1 ? "bg-white/30" : ""
                      }`}
                    />
                  </div>
                </div>
                {i % 2 === 1 && (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16 bg-indigo-200/40 dark:bg-indigo-700/40" />
                  </div>
                )}
              </div>
              {i % 2 === 1 && (
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md ring-2 ring-indigo-400/30 dark:ring-indigo-300/20">
                  <Skeleton className="h-6 w-6 rounded-full bg-white/30" />
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export function LoadingDots({ label = "Thinking" }: { label?: string }) {
  const sizeClass = "h-1.5 w-1.5";

  return (
    <div
      className="flex items-center gap-1.5 py-0.5"
      role="status"
      aria-live="polite"
      aria-label={`${label}…`}
    >
      <div
        className={`${sizeClass} bg-indigo-600 rounded-full shadow-sm animate-[pulse_1.2s_ease-in-out_0ms_infinite]`}
      />
      <div
        className={`${sizeClass} bg-indigo-600 rounded-full shadow-sm animate-[pulse_1.2s_ease-in-out_200ms_infinite]`}
      />
      <div
        className={`${sizeClass} bg-indigo-600 rounded-full shadow-sm animate-[pulse_1.2s_ease-in-out_400ms_infinite]`}
      />
    </div>
  );
}
