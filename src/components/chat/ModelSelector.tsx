import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cpu, Languages, Check, Zap, Brain, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_MODELS, type ModelId } from "@/lib/message-api/constants";
import { useState } from "react";

interface ModelSelectorProps {
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  className?: string;
}

interface SimpleModel {
  id: ModelId;
  name: string;
  description: string;
  provider: "groq" | "cohere";
  icon: React.ComponentType<any>;
  features: string[];
}

const getModelIcon = (config: any): React.ComponentType<any> => {
  if (config.provider === "groq") return Zap;
  if (config.supportsReasoning) return Brain;
  if (config.name.toLowerCase().includes("aya")) return Languages;
  return Cpu;
};

const allModels: SimpleModel[] = Object.entries(ALL_MODELS).map(
  ([id, config]) => ({
    id: id as ModelId,
    name: config.name,
    description: config.description,
    provider: config.provider as "groq" | "cohere",
    icon: getModelIcon(config),
    features: [
      `${config.maxTokens.toLocaleString()} tokens`,
      ...(config.supportsCitations ? ["Citations"] : []),
      ...(config.supportsReasoning ? ["Advanced reasoning"] : []),
      ...(config.provider === "groq" ? ["Ultra-fast"] : []),
    ],
  })
);

const modelsByProvider = allModels.reduce((acc, model) => {
  if (!acc[model.provider]) {
    acc[model.provider] = [];
  }
  acc[model.provider].push(model);
  return acc;
}, {} as Record<string, SimpleModel[]>);

const getProviderInfo = (provider: string) => {
  switch (provider) {
    case "groq":
      return {
        icon: Zap,
        name: "Groq Models",
        badge: "(Recommended)",
        color: "text-yellow-500",
      };
    case "cohere":
      return {
        icon: Cpu,
        name: "Cohere Models",
        badge: "",
        color: "text-indigo-500",
      };
    default:
      return {
        icon: Cpu,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Models`,
        badge: "",
        color: "text-gray-500",
      };
  }
};

export function ModelSelector({
  selectedModel,
  onModelChange,
  className,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModelData = allModels.find((m) => m.id === selectedModel);

  const ModelItem = ({ model }: { model: SimpleModel }) => {
    const Icon = model.icon;
    const isSelected = selectedModel === model.id;

    return (
      <div
        onClick={() => {
          onModelChange(model.id);
          setIsOpen(false);
        }}
        className={cn(
          "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
          isSelected
            ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2 rounded-md",
              isSelected
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {model.name}
              </h4>
              {isSelected && (
                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {model.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {model.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              {selectedModelData && (
                <selectedModelData.icon className="h-3.5 w-3.5" />
              )}
              <span className="max-w-32 truncate">
                {selectedModelData?.name}
              </span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select AI Model</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto">
            {Object.entries(modelsByProvider).map(([provider, models]) => {
              const providerInfo = getProviderInfo(provider);
              const ProviderIcon = providerInfo.icon;

              return (
                <div key={provider} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ProviderIcon
                      className={cn("h-4 w-4", providerInfo.color)}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {providerInfo.name}
                    </h3>
                    {providerInfo.badge && (
                      <span className="text-sm text-gray-500">
                        {providerInfo.badge}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {models.map((model) => (
                      <ModelItem key={model.id} model={model} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
