import { z } from "zod";

export const createAccountSchema = z.object({
  email: z.email({
    error: "Please provide a valid email address",
  }),
  password: z.string().min(6, {
    error: "Password must be at least 6 characters long",
  }),
  username: z.string().min(3, {
    error: "Username must be at least 3 characters long",
  }),
});
