import { getQdrant } from "./client";
import { embedText } from "../../embeddings/ollama-embeddings";
import { VectorRecord, QuestionsCachePayload } from "../common/schema";

const COLLECTION = process.env.QDRANT_COLLECTION || "questions_cache";
const VECTOR_SIZE = Number(process.env.QDRANT_VECTOR_SIZE || 768);

export const ensureCollection = async (): Promise<void> => {
  const q = getQdrant();
  try {
    await q.getCollection(COLLECTION);
    return;
  } catch {
    await q.createCollection(COLLECTION, {
      vectors: { size: VECTOR_SIZE, distance: "Cosine" },
    } as any);
  }
};

const buildKeyText = (p: { language: string; topic: string; numQuestions: number }) =>
  `${p.language}::${p.topic}::${p.numQuestions}`;

export const upsertQuestionsCache = async (payload: QuestionsCachePayload): Promise<void> => {
  await ensureCollection();
  const q = getQdrant();
  const keyText = buildKeyText(payload);
  const vector = await embedText(keyText);
  const points: VectorRecord<QuestionsCachePayload>[] = [
    { id: keyText, vector, payload },
  ];
  await q.upsert(COLLECTION, {
    wait: true,
    points: points.map((p) => ({ id: p.id, vector: p.vector, payload: p.payload })),
  } as any);
};

export const queryQuestionsCache = async (p: {
  language: string;
  topic: string;
  numQuestions: number;
  limit?: number;
  minScore?: number;
}): Promise<QuestionsCachePayload | null> => {
  await ensureCollection();
  const q = getQdrant();
  const vector = await embedText(buildKeyText(p));
  const res: any = await q.search(COLLECTION, {
    vector,
    limit: p.limit ?? 1,
    with_payload: true,
  } as any);

  const hit = Array.isArray(res) ? res[0] : res?.result?.[0];
  if (!hit) return null;

  const score = hit.score ?? hit?.result?.score ?? 0;
  if (p.minScore && score < p.minScore) return null;

  const payload: QuestionsCachePayload | undefined = hit.payload as any;
  return payload ?? null;
};
