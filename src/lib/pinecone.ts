import { Pinecone } from "@pinecone-database/pinecone";

export const PineconeClient = () => {
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

  return client;
};

export const UpsertEmbeddings = async (
  embeddings: number[],
  namespace: string,
  text: string
) => {
  const pinecone = PineconeClient();
  const pineconeIndex = pinecone.Index("chatdoc");

  await pineconeIndex.namespace(namespace).upsert([
    {
      id: "0",
      values: embeddings,
      metadata: { text: "test" },
    },
  ]);
};
