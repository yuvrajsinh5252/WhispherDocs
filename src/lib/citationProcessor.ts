import type { Citation } from "@/types/citation";

export async function processCitationsInStream(
  response: AsyncIterable<any>,
  controller: ReadableStreamDefaultController,
  fileName: string
): Promise<{ finalMessage: string; thinking?: string }> {
  let finalMessage = "";
  let currentCitation: Citation | null = null;
  let citationIndex = 1;
  let citations: Citation[] = [];
  let textBuffer = "";
  const citationSources = new Map<string, number>();
  let pendingCitations: Citation[] = [];
  let thinkingBuffer = "";

  for await (const event of response) {
    console.log(`event_type: ${event.type}`);

    if (event.type === "content-delta") {
      if (event.delta.message.content.thinking) {
        const thinkingContent = event.delta.message.content.thinking;
        thinkingBuffer += thinkingContent;

        const thinkingChunk =
          JSON.stringify({
            type: "thinking",
            content: thinkingContent,
          }) + "\n";
        controller.enqueue(thinkingChunk);
      } else {
        const textContent = event.delta?.message?.content?.text || "";
        textBuffer += textContent;
        finalMessage += textContent;
        controller.enqueue(textContent);
      }

      if (textBuffer.endsWith("\n\n")) {
        pendingCitations = [];
      }
    }

    if (event.type === "citation-start") {
      const citationData = event.delta || {};
      const source = event.delta?.message?.citations?.sources?.[0];
      const actualPageNumber = source?.metadata?.page_number;
      const pageId = source?.id;

      const pageIdentifier =
        actualPageNumber !== undefined ? actualPageNumber : pageId;
      const docPage = `${fileName}:${pageIdentifier || "unknown"}`;
      let existingIndex = citationSources.get(docPage);

      if (existingIndex === undefined) {
        existingIndex = citationIndex++;
        citationSources.set(docPage, existingIndex);
      }

      currentCitation = {
        index: existingIndex,
        text: citationData.message?.citations?.text || "",
        start: citationData.message?.citations?.start,
        end: citationData.message?.citations?.end,
        type: citationData.message?.citations?.type,
        sources: Array.isArray(citationData.message?.citations?.sources)
          ? citationData.message?.citations?.sources.map((source: any) => {
              return source;
            })
          : [],
        document: fileName,
        page:
          actualPageNumber !== undefined
            ? String(actualPageNumber)
            : pageId
            ? pageId[pageId.length - 1]
            : undefined,
      };

      if (!citations.some((c) => c.index === existingIndex)) {
        citations.push(currentCitation);
      }

      if (!pendingCitations.some((c) => c.index === existingIndex)) {
        pendingCitations.push(currentCitation);
      }
    } else if (event.type === "citation-end") {
      currentCitation = null;
    }
  }

  if (citations.length > 0) {
    const footnotesSection = "\n\n---\n\n### Sources\n\n";
    controller.enqueue(footnotesSection);
    finalMessage += footnotesSection;

    citations
      .sort((a, b) => a.index - b.index)
      .forEach((citation) => {
        const pageInfo = citation.page ? ` (Page ${citation.page})` : "";
        const footnote = `${citation.index}. *${citation.document}*${pageInfo}\n`;
        controller.enqueue(footnote);
        finalMessage += footnote;
      });
  }

  return {
    finalMessage,
    thinking: thinkingBuffer,
  };
}
