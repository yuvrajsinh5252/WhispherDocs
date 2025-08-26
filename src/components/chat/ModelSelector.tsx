import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cpu, Check, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALL_AVAILABLE_MODELS as ALL_MODELS,
  type ModelId,
} from "@/lib/chat-api/constants";
import { useChatStore } from "@/stores/chatStore";

interface ModelSelectorProps {
  className?: string;
}

interface SimpleModel {
  id: ModelId;
  name: string;
  description: string;
  maxTokens: number;
  provider: string;
  supportsCitations: boolean;
  supportsReasoning: boolean;
  icon: React.ComponentType<any>;
  useCase: string;
}

const getModelIcon = (config: any): React.ComponentType<any> => {
  if (config.provider === "groq") return Cpu;
  if (config.supportsReasoning) return Cpu;
  if (config.name.toLowerCase().includes("aya")) return Languages;
  return Cpu;
};

const getUseCase = (config: any): string => {
  if (config.supportsReasoning) return "Reasoning & Analysis";
  if (config.supportsCitations) return "Document Q&A";
  if (config.provider === "groq") return "Fast Processing";
  return "General Purpose";
};

const models: SimpleModel[] = Object.entries(ALL_MODELS).map(
  ([id, config]) => ({
    id: id as ModelId,
    name: config.name,
    description: config.description,
    maxTokens: config.maxTokens,
    provider: config.provider,
    supportsCitations: config.supportsCitations,
    supportsReasoning: config.supportsReasoning,
    icon: getModelIcon(config),
    useCase: getUseCase(config),
  })
);

export function ModelSelector({ className }: ModelSelectorProps) {
  const { selectedModel, setSelectedModel } = useChatStore();
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
                onSelect={() => setSelectedModel(model.id)}
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
