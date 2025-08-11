import { GenerateQuestionsInput } from "../common/types";

export const buildQuestionsPrompt = (input: GenerateQuestionsInput) => {
  const system = `You are an expert teacher generating high-quality, concise flashcard-style question-answer pairs.
Requirements:
- Respond strictly in valid JSON matching this TypeScript type: { questions: { question: string; answer: string; topic: string; language: string }[] }
- Language: ${input.language} (all questions and answers must be in this language)
- Topic: ${input.topic}
- Number of questions: ${input.numQuestions}
- Focus on clear questions and succinct, correct answers.
- Avoid fluff; 1-2 sentences per answer.
- Ensure variety in the questions covering subtopics.
- No code fences; return only the JSON object.
`;

  const user = `Generate ${input.numQuestions} question-answer pairs about: ${input.topic}.
Return as {"questions":[{"question":"...","answer":"...","topic":"${input.topic}","language":"${input.language}"}, ...]}`;

  return { system, user };
};
