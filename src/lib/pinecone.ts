import { Pinecone } from "@pinecone-database/pinecone";

export const PineconeClient = () => {
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

  return client;
};
