import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { MessageValidator } from "@/lib/validator/MessageValidator";
import { db } from "@/db";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { CohereClientV2 } from "cohere-ai";

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

    const hasRelevantContext = results.some(
      (r) => r.pageContent.trim().length > 0
    );

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

    const response = await cohere.chatStream({
      model: "command-a-03-2025",
      temperature: 0.2,
      citationOptions: {
        mode: "FAST",
      },
      messages: [
        {
          role: "system",
          content: `You are a document assistant that ONLY answers questions based on the content of the specific document uploaded by the user.

          CRITICAL INSTRUCTIONS:
          1. ONLY use information provided in the document context to answer questions.
          2. If the user's question has no relation to the document or the query is generic (like greetings):
            - Respond with a helpful message like "Hello! I'm your document assistant. How can I help you with the uploaded document today?"
            - For other off-topic questions, say "I can only answer questions about the document you've uploaded. Could you please ask something related to the document content?"
          3. NEVER provide information not contained in the document context.
          4. NEVER reference personal information about any individual unless it's specifically mentioned in the document context.
          5. NEVER refer to any specific name, company, or details not found in the document context.
          6. NEVER make assumptions about who the user is or what documents they may have uploaded previously.
          7. If the document context doesn't contain information to answer the question, clearly state "I don't see information about that in your uploaded document."`,
        },
        {
          role: "user",
          content: `Answer the user's question using ONLY the provided document context. Format your response in markdown for better readability.

          INSTRUCTIONS:
          1. First, carefully evaluate if the provided document context is relevant to the user's question
          2. If the context IS relevant:
             - Answer based on the document context with specific references
             - Cite the relevant parts of the document that support your answer
          3. If the context is NOT relevant or doesn't contain the answer:
             - Clearly state "I don't see information about that in your uploaded document."
             - DO NOT provide general knowledge responses unrelated to the document
          4. Only address what's specifically asked in the current question
          5. Format your response appropriately with markdown for readability
          6. For follow-up questions:
             - Consider both the previous conversation and the document context
             - Maintain consistency with previous answers
          7. If the query is a simple greeting or off-topic from the document:
             - Respond with a friendly greeting and redirect focus to the document

          RECENT CONVERSATION:
          ${formattedHistory}

          Document context (only use this information if relevant to the user question):
          ${results.map((r) => r.pageContent).join("\n\n")}

          Has relevant context from document: ${hasRelevantContext}

          USER QUESTION: ${message}`,
        },
      ],
    });

    const stream = new ReadableStream({
      async start(controller) {
        let finalMessage = "";

        for await (const event of response) {
          if (event.type === "citation-start") {
            controller.enqueue(`**Citations-start:**\n`);
          }
          if (event.type === "citation-end") {
            controller.enqueue(`**Citations-end:**\n`);
          }
          if (event.type === "content-delta") {
            controller.enqueue(event.delta?.message?.content?.text);
            finalMessage += event.delta?.message?.content?.text;
          }
        }
        controller.close();

        await db.messages.create({
          data: {
            text: finalMessage,
            isUserMessage: false,
            userId: user?.id,
            fileId: fileId,
          },
        });
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
