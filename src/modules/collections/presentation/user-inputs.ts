import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
});

export const deleteCollectionSchema = z.object({
  collectionId: z.string(),
});

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
