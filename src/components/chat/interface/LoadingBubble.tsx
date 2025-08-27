import { LoadingDots } from "../Thinking";

export default function LoadingBubble() {
  return (
    <div className="flex items-center justify-start space-x-3">
      <LoadingDots />
      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
        Processing...
      </span>
    </div>
  );
}
