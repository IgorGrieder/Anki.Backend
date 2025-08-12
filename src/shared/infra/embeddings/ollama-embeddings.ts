import { Ollama } from "ollama";

const client = new Ollama({ host: process.env.OLLAMA_HOST || "http://127.0.0.1:11434" });
const embedModel = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

export const embedText = async (text: string): Promise<number[]> => {
  const res = (await client.embeddings({ model: embedModel, prompt: text })) as any;
  const vector: number[] = res?.embedding || res?.embeddings || [];
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error("Embedding failed or returned empty vector");
  }
  return vector.map((v: any) => Number(v));
};
