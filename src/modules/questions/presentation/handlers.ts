import { Request, Response } from "express";
import { generateQuestions } from "../app/generate-questions";
import { GenerateQuestionsInput } from "../common/types";

export const generateQuestionsHandler = async (req: Request, res: Response) => {
  const input: GenerateQuestionsInput = req.body.validated;
  const result = await generateQuestions(input);
  res.status(200).json(result);
};
