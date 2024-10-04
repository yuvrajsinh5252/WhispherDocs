import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { MessageValidator } from "@/lib/validator/MessageValidator";
import { db } from "@/db";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeClient } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { CohereClient } from "cohere-ai";

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

  // vectorize message
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
    orderBy: { createdAt: "asc" },
    take: 2,
  });

  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });

  const response = await cohere.chatStream({
    model: "command-r-plus",
    temperature: 0,
    message: message,
    chatHistory: prevMessages.map((m) => ({
      role: m.isUserMessage ? "USER" : "CHATBOT",
      message: m.text,
    })),
    documents: [
      {
        role: "system",
        content:
          "The user is asking question from the uploaded PDF and you are trying to answer using that content. Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, stick to the context provided and try to answer it naturally.
        \n If the user asks the same question again, handle it gracefully and don't reapeat your answer.
        \n----------------\n
        PREVIOUS CONVERSATION:
        ${prevMessages.map((m) => m.text).join("\n\n")}
        \n----------------\n
        CONTEXT:
        ${results.map((r) => r.pageContent).join("\n\n")}
        USER INPUT: ${message}`,
      },
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      let finalMessage = "";

      for await (const event of response) {
        if (event.eventType === "text-generation") {
          controller.enqueue(event.text);
          finalMessage += event.text;
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

  // returned the streamed response and let the client handle the streaming
  return new Response(stream);
};
