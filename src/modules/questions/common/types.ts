import { z } from "zod";

export const generateQuestionsSchema = z.object({
  topic: z.string().min(1),
  numQuestions: z.number().int().min(1).max(50),
  language: z.string().min(2).max(10),
});

export type GenerateQuestionsInput = z.infer<typeof generateQuestionsSchema>;

export const questionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  topic: z.string(),
  language: z.string(),
});

export type GeneratedQuestion = z.infer<typeof questionSchema>;

export const questionsResponseSchema = z.object({
  questions: z.array(questionSchema),
});

export type QuestionsResponse = z.infer<typeof questionsResponseSchema>;
