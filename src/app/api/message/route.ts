import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server"
import { MessageValidator } from "@/lib/validator/MessageValidator";
import { db } from "@/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

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
        }
    })

    // vectorize message
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const pinecone = await pineconeClient();
    const pineconeIndex = pinecone.Index("chatdoc");

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
    })

    const formattedPrevMessages = prevMessages.map((message) => ({
        role: message.isUserMessage ? "user" as const : "assistant" as const,
        content: message.text,
    }))

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
            {
                role: 'system',
                content:
                    'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
                role: 'user',
                content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

        \n----------------\n

        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
                    if (message.role === 'user') return `User: ${message.content}\n`
                    return `Assistant: ${message.content}\n`
                })}

        \n----------------\n

        CONTEXT:
        ${results.map((r) => r.pageContent).join('\n\n')}

        USER INPUT: ${message}`,
            },
        ],

    })

    const stream = OpenAIStream(response, {
        async onCompletion(completions) {
            await db.messages.create({
                data: {
                    text: completions,
                    isUserMessage: false,
                    userId: user?.id,
                    fileId: fileId,
                }
            })
        }
    })

    // returned the streamed response and let the client handle the streaming
    return new StreamingTextResponse(stream)
}