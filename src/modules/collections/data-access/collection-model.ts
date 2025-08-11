import mongoose from "mongoose";
import { CollectionDocument } from "../common/collection-types";

const cardSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    topic: { type: String, required: true },
  },
  { _id: true }
);

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    cards: { type: [cardSchema], default: [] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CollectionModel = mongoose.model<CollectionDocument>(
  "Collection",
  collectionSchema
);
