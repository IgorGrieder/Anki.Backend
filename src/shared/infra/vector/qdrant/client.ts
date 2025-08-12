import { QdrantClient } from "@qdrant/js-client-rest";

let client: QdrantClient | null = null;

export const getQdrant = () => {
  if (client) return client;
  const url = process.env.QDRANT_URL || "http://localhost:6333";
  const apiKey = process.env.QDRANT_API_KEY;
  client = new QdrantClient({ url, apiKey });
  return client;
};
