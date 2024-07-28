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

  const pinecone = await PineconeClient();
  const pineconeIndex = pinecone.Index("cohere-pinecone-trec");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.messages.findMany({
    where: {
      fileId: file.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });

  const response = await cohere.chatStream({
    chatHistory: prevMessages.map((m) => ({
      role: m.isUserMessage ? "USER" : "CHATBOT",
      message: m.text,
    })),
    message: message,
    // conversationId: file.id,
  });

  // returned the streamed response and let the client handle the streaming
};
