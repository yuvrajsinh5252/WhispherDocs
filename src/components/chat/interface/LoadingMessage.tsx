import { LoadingDots } from "../Thinking";

export const loadingMessage = {
  createdAt: new Date().toISOString(),
  id: "loading-message",
  isUserMessage: false,
  hasThinking: false,
  text: (
    <div className="flex items-center justify-start space-x-3">
      <LoadingDots />
      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
        Processing...
      </span>
    </div>
  ),
};
