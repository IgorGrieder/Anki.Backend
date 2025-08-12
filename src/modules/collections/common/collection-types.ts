import { z } from "zod";

export const cardSchema = z.object({
  _id: z.any().transform((v) => v.toString()).optional(),
  question: z.string().min(1),
  answer: z.string().min(1),
  topic: z.string().min(1),
});

export const collectionDocumentSchema = z.object({
  _id: z.any().transform((v) => v.toString()),
  name: z.string().min(1),
  category: z.string().min(1),
  owner: z.any().transform((v) => v.toString()),
  cards: z.array(cardSchema).default([]),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type CollectionDocument = z.infer<typeof collectionDocumentSchema>;
export type Card = z.infer<typeof cardSchema>;

export const createCollectionSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
});

export const deleteCollectionSchema = z.object({
  collectionId: z.string(),
});

export const getCollectionsSchema = z.object({});

export const addCardSchema = z.object({
  collectionId: z.string(),
  question: z.string().min(1),
  answer: z.string().min(1),
  topic: z.string().min(1),
});

export const updateCardSchema = z.object({
  collectionId: z.string(),
  cardId: z.string(),
  topic: z.string().min(1),
  answer: z.string().min(1),
  question: z.string().min(1),
  hasNewImage: z.boolean().optional(),
});

export const deleteCardSchema = z.object({
  collectionId: z.string(),
  cardId: z.string(),
});
