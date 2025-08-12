export type VectorRecord<TPayload = any> = {
  id: string;
  vector: number[];
  payload: TPayload;
};

export type QuestionsCachePayload = {
  language: string;
  topic: string;
  numQuestions: number;
  response: { questions: { question: string; answer: string; topic: string; language: string }[] };
};
