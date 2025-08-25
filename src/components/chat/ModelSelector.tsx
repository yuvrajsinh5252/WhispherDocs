import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cpu, Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type AIModel = "command-a-reasoning-08-2025" | "aya";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  className?: string;
}

const models = [
  {
    id: "command-a-reasoning-08-2025" as AIModel,
    name: "Command A Reasoning",
    icon: Cpu,
    description: "Advanced reasoning, 256K context, agentic capabilities",
    features: [
      "Multi-step logical analysis",
      "256K token context window",
      "Agentic problem-solving",
      "Tool use capabilities",
      "Multilingual reasoning (23 languages)",
    ],
    useCase: "Best for complex analysis, agentic tasks, multilingual documents",
  },
  {
    id: "aya" as AIModel,
    name: "Aya",
    icon: Languages,
    description: "Wide multilingual conversations with reasoning",
    features: [
      "23+ language support",
      "Cultural context awareness",
      "Multilingual document analysis",
      "Cross-language insights",
      "Culturally sensitive responses",
    ],
    useCase:
      "Best for multilingual users, international documents, cultural analysis",
  },
];

export function ModelSelector({
  selectedModel,
  onModelChange,
  className,
}: ModelSelectorProps) {
  const selectedModelData = models.find((m) => m.id === selectedModel);

  return (
    <div className={cn("relative w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              {selectedModel === "command-a-reasoning-08-2025" ? (
                <Cpu className="h-3.5 w-3.5" />
              ) : (
                <Languages className="h-3.5 w-3.5" />
              )}
              <span>{selectedModelData?.name}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-4 space-y-2"
          side="top"
          sideOffset={8}
          align="center"
        >
          <DropdownMenuLabel className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Choose AI Model
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              Select the model that best fits your needs
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {models.map((model) => {
            const Icon = model.icon;
            const isSelected = selectedModel === model.id;

            return (
              <DropdownMenuItem
                key={model.id}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                  isSelected
                    ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-gray-200 dark:border-gray-700"
                )}
                onSelect={() => onModelChange(model.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-1.5 rounded-md",
                      isSelected
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {model.name}
                      </h4>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {model.description}
                    </p>

                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                      {model.useCase}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
