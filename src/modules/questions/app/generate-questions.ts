import { GenerateQuestionsInput, QuestionsResponse } from "../common/types";
import { generateQuestionsWithLLM } from "./llm";
import { queryQuestionsCache, upsertQuestionsCache } from "../../../shared/infra/vector/qdrant/questions-cache";

export const generateQuestions = async (input: GenerateQuestionsInput): Promise<QuestionsResponse> => {
  const cached = await queryQuestionsCache({
    language: input.language,
    topic: input.topic,
    numQuestions: input.numQuestions,
    minScore: 0.88,
  });

  if (cached) return cached.response;

  const fresh = await generateQuestionsWithLLM(input);
  await upsertQuestionsCache({
    language: input.language,
    topic: input.topic,
    numQuestions: input.numQuestions,
    response: fresh,
  });
  return fresh;
};
