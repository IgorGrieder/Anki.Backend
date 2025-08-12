import mongoose from "mongoose";
import crypto from "crypto";
import { QuestionsResponse } from "../common/types";

// Minimal embedding using Node crypto for determinism; replace with real embeddings later
export const embedKey = (key: string): string => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

const vectorCacheSchema = new mongoose.Schema(
  {
    key_hash: { type: String, unique: true, index: true },
    payload: { type: Object, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export interface VectorCacheDoc extends mongoose.Document {
  key_hash: string;
  payload: QuestionsResponse;
}

export const VectorCacheModel = mongoose.model<VectorCacheDoc>("VectorCache", vectorCacheSchema);

export const fetchFromCache = async (key: string): Promise<QuestionsResponse | null> => {
  const key_hash = embedKey(key);
  const doc = await VectorCacheModel.findOne({ key_hash });
  return doc ? (doc.payload as QuestionsResponse) : null;
};

export const saveToCache = async (key: string, payload: QuestionsResponse): Promise<void> => {
  const key_hash = embedKey(key);
  await VectorCacheModel.updateOne(
    { key_hash },
    { $set: { payload } },
    { upsert: true }
  );
};
