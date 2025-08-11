import { GenerateQuestionsInput, QuestionsResponse } from "../common/types";
import { fetchFromCache, saveToCache } from "../data-access/vector-cache";
import { generateQuestionsWithLLM } from "./llm";

const buildCacheKey = (input: GenerateQuestionsInput): string => {
  return `${input.language}::${input.topic}::${input.numQuestions}`;
};

export const generateQuestions = async (input: GenerateQuestionsInput): Promise<QuestionsResponse> => {
  const key = buildCacheKey(input);
  const cached = await fetchFromCache(key);
  if (cached) return cached;

  const fresh = await generateQuestionsWithLLM(input);
  await saveToCache(key, fresh);
  return fresh;
};
