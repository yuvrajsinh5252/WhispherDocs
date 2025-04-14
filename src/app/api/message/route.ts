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
          content:
            "You are a helpful AI assistant that primarily answers questions based on PDF documents uploaded by the user. Your answers should be clear, concise, and directly reference the content from the document when possible. While your primary focus is on the document content, you can provide brief, general knowledge responses when the question is outside the document scope.",
        },
        {
          role: "user",
          content: `Answer the user's question primarily using information from the provided context. Format your response in markdown for better readability.

          INSTRUCTIONS:
          1. If the answer is found in the context, provide it clearly with relevant details
          2. If the answer isn't in the context but is common knowledge, you may provide a brief, factual response
          3. If uncertain about facts outside the document, indicate your uncertainty appropriately
          4. Focus specifically on answering what was asked without unnecessary information
          5. For follow-up questions:
             - Refer to the previous conversation to understand the context
             - If the follow-up refers to "this" or other vague terms, use the previous questions for context
          6. Use bullet points, headings, or formatting when it helps clarify complex information

          RECENT CONVERSATION:
          ${formattedHistory}

          CONTEXT FROM DOCUMENT:
          ${results.map((r) => r.pageContent).join("\n\n")}

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
          if (event.type === "citation-start") {
            controller.enqueue(`**Citations-end:**\n`);
          }
          if (event.type === "content-delta") {
            controller.enqueue(event.delta?.message?.content?.text);
            finalMessage += event.delta?.message?.content?.text;
          }
        }
        controller.close();

        // await db.messages.create({
        //   data: {
        //     text: finalMessage,
        //     isUserMessage: false,
        //     userId: user?.id,
        //     fileId: fileId,
        //   },
        // });
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

    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
