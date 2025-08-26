"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Messages from "@/components/chat/Messages";
import ChatInput from "@/components/chat/ChatInput";
import { ModelSelector } from "@/components/chat/ModelSelector";
import PDFrenderer from "@/components/PDFrenderer";
import { GripVertical, GripHorizontal } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useChatStore } from "@/stores/chatStore";
import { useEffect } from "react";

export function ChatLayout(
  props: React.PropsWithChildren<{
    file: any;
  }>
) {
  const { isMobile } = useScreenSize();
  const { setFileId } = useChatStore();

  useEffect(() => {
    setFileId(props.file.id);
  }, [props.file.id, setFileId]);

  return (
    <ResizablePanelGroup
      direction={isMobile ? "vertical" : "horizontal"}
      className="flex-1 gap-1 rounded-lg overflow-hidden"
    >
      <ResizablePanel
        defaultSize={!isMobile ? 60 : 30}
        minSize={!isMobile ? 40 : 0}
        className="relative flex flex-col sm:min-h-0"
      >
        <div className="absolute inset-0 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <PDFrenderer url={props.file.url} />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-transparent">
        <div
          className={`flex ${
            isMobile ? "h-1.5 w-20" : "h-20 w-1.5"
          } items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800`}
        >
          {isMobile ? (
            <GripHorizontal className="h-4 w-4 text-gray-500" />
          ) : (
            <GripVertical className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </ResizableHandle>

      <ResizablePanel
        defaultSize={!isMobile ? 40 : 70}
        minSize={!isMobile ? 30 : 0}
        className="relative flex flex-col sm:min-h-0"
      >
        <div className="absolute inset-0 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden scrollbar-none hover:scrollbar-thin">
            <Messages />
          </div>

          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <ModelSelector />
              </div>
              <ChatInput />
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
