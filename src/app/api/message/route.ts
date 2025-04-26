import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { MessageValidator } from "@/lib/validator/MessageValidator";
import { db } from "@/db";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { CohereClientV2 } from "cohere-ai";
import { processCitationsInStream } from "@/lib/citationProcessor";
import { V2ChatStreamRequest } from "cohere-ai/api";

export const maxDuration = 59;

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return new Response("Unauthorized", { status: 401 });

  const { fileId, message } = MessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user?.id,
    },
  });

  if (!file) return new Response("Not Found", { status: 404 });

  await db.messages.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user?.id,
      fileId: fileId,
    },
  });

  try {
    const embeddings = new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY,
      model: "embed-english-v3.0",
    });

    const pinecone = PineconeClient();
    const pineconeIndex = pinecone.Index("cohere-pinecone-trec");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await db.messages.findMany({
      where: { fileId: file.id },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    const formattedHistory = prevMessages
      .reverse()
      .map((m) => `${m.isUserMessage ? "Human" : "Assistant"}: ${m.text}`)
      .join("\n\n");

    const cohere = new CohereClientV2({
      token: process.env.COHERE_API_KEY,
    });

    const queryClassification = await cohere.chat({
      model: "command-a-03-2025",
      temperature: 0.0,
      messages: [
        {
          role: "system",
          content: `You are a query classifier. Analyze the user's query and determine if it:
        1. Requires document-specific knowledge (DOCUMENT_SPECIFIC)
        2. Is a simple general question that doesn't need document context (GENERAL_QUERY)

        Consider the document search results when making your decision. If the search results seem
        relevant to the query, it's likely DOCUMENT_SPECIFIC. If the search results don't contain
        relevant information, it may be GENERAL_QUERY.

        Return ONLY "DOCUMENT_SPECIFIC" or "GENERAL_QUERY" as your answer with no additional text.`,
        },
        {
          role: "user",
          content: `Classify this query: "${message}"

        Document search results:
        ${results
          .map(
            (r, i) => `[Result ${i + 1}]: ${r.pageContent.substring(0, 200)}...`
          )
          .join("\n\n")}`,
        },
      ],
    });

    const responseType =
      queryClassification.message?.content?.[0]?.text || "DOCUMENT_SPECIFIC";
    const needsDocumentContext = responseType === "DOCUMENT_SPECIFIC";

    const documentChunks = results.map((result, index) => {
      return {
        id: `doc-${index + 1}`,
        data: { text: result.pageContent },
        ...(result.metadata && {
          metadata: {
            ...result.metadata,
            source: file.name,
          },
        }),
      };
    });

    const chatConfig: V2ChatStreamRequest = {
      model: "command-a-03-2025",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You are a helpful document assistant that primarily answers questions about the user's uploaded document.

          INSTRUCTIONS:
          1. Your primary function is to help users understand their document content.
          2. Prioritize information from the document when answering specific questions about its content.
          3. For requests like "summarize this document", "extract key points", or "describe this image", provide helpful responses based on the document.
          4. Handle conversational queries naturally while keeping focus on helping with the document.
          5. When asked about topics not covered in the document, you can:
             - Briefly answer general knowledge questions related to the document's domain
             - For completely unrelated questions, gently redirect to document-related assistance
          6. Format responses with markdown for better readability when appropriate.
          7. Be concise but comprehensive in your answers.`,
        },
        {
          role: "user",
          content: needsDocumentContext
            ? `Answer the user's question in a helpful and informative way.

          INSTRUCTIONS:
          1. First, determine the type of request:
             - Document content question (e.g., "What does page 3 say about X?")
             - Document operation request (e.g., "Summarize this PDF", "Extract key points")
             - General conversation related to document domain
             - Completely unrelated question

          2. For document content questions:
             - Use the provided context if relevant
             - If the context doesn't contain the answer, check if it's likely elsewhere in the document
             - Be honest when information isn't in the document

          3. For document operation requests:
             - For summaries: Provide a comprehensive overview of main points
             - For key points: Extract and organize important information
             - For images: Describe visible content in the document if mentioned

          4. Format responses appropriately with markdown for readability

          5. For follow-up questions, maintain context from the conversation history

          RECENT CONVERSATION:
          ${formattedHistory}

          Document context (use when relevant to the user's question):
          ${results.map((r) => r.pageContent).join("\n\n")}

          USER QUESTION: ${message}`
            : `Answer the user's general question without referring to document context.

          RECENT CONVERSATION:
          ${formattedHistory}

          USER QUESTION: ${message}`,
        },
      ],
    };

    if (needsDocumentContext) {
      chatConfig.documents = documentChunks;
      chatConfig.citationOptions = { mode: "FAST" };
    }

    const response = await cohere.chatStream(chatConfig);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const finalMessage = await processCitationsInStream(
            response,
            controller,
            file.name
          );

          await db.messages.create({
            data: {
              text: finalMessage,
              isUserMessage: false,
              userId: user?.id,
              fileId: fileId,
            },
          });

          controller.close();
        } catch (error) {
          console.error("Error processing citations:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("API route error:", error);

    await db.messages.create({
      data: {
        text: "Sorry, I encountered an error processing your request. Please try again with a shorter query.",
        isUserMessage: false,
        userId: user?.id,
        fileId: fileId,
      },
    });

    await db.messages.deleteMany({
      where: {
        userId: user?.id,
        fileId: fileId,
        isUserMessage: true,
        text: message,
      },
    });

    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
