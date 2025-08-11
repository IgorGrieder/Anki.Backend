import { Ollama } from "ollama";
import { buildQuestionsPrompt } from "./prompt";
import { GenerateQuestionsInput, questionsResponseSchema, QuestionsResponse } from "../common/types";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || "http://127.0.0.1:11434" });
const model = process.env.OLLAMA_MODEL || "llama3.2";

export const generateQuestionsWithLLM = async (input: GenerateQuestionsInput): Promise<QuestionsResponse> => {
  const { system, user } = buildQuestionsPrompt(input);
  const res = await ollama.chat({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  // Ollama returns { message: { content } } shape
  const content = (res as any)?.message?.content ?? "";
  const parsed = JSON.parse(content);
  const validated = questionsResponseSchema.parse(parsed);
  return validated;
};
