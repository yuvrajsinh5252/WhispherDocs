import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MODELS, type ModelId } from "@/lib/chat-api/models";
import { useChatStore } from "@/stores/chatStore";
import { Check, Lightbulb, MessageSquare } from "lucide-react";

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const selectedModelData = MODELS[selectedModel as keyof typeof MODELS];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 backdrop-blur-lg hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            {selectedModel && selectedModelData && selectedModelData.icon && (
              <selectedModelData.icon className="h-3.5 w-3.5" />
            )}
            <span>{selectedModelData?.name || "Select"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 max-h-64 overflow-y-auto p-1.5 border flex flex-col gap-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-3xl bg-transparent custom-scrollbar"
        side="top"
        sideOffset={4}
        align="center"
      >
        {Object.entries(MODELS).map(([modelId, model]) => {
          const isSelected = selectedModel === modelId;

          return (
            <DropdownMenuItem
              key={modelId}
              className={cn(
                "flex items-start gap-2 px-2.5 py-2 border-b border-gray-200/50 dark:border-gray-700/45 rounded-md cursor-pointer transition-all duration-200 border",
                isSelected
                  ? "bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 shadow-sm"
                  : "hover:bg-gray-50/80 dark:hover:bg-gray-900/90 hover:border-gray-200/50 dark:hover:border-gray-700/50"
              )}
              onSelect={() => setSelectedModel(modelId as ModelId)}
            >
              <div
                className={cn(
                  "p-1 rounded-md transition-all duration-200",
                  isSelected
                    ? "bg-blue-100/80 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400"
                )}
              >
                {model.icon && <model.icon className="h-3.5 w-3.5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {model.name}
                  </span>
                  {isSelected && (
                    <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {model.provider?.provider || "Unknown"}
                  </span>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {model.maxTokens?.toLocaleString() || "0"} tokens
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {model.supportsCitations && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Citations
                      </span>
                    </div>
                  )}
                  {model.supportsReasoning && (
                    <div className="flex items-center gap-1">
                      <Lightbulb className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Reasoning
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
