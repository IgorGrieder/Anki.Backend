import { z } from "zod";

export const loginUserSchema = z.object({
  login: z.union([
    z.email({
      error: "Please provide a valid email address",
    }),
    z.string().min(3, {
      error: "Username must be at least 3 characters long",
    }),
  ]),
  passowrd: z.string().min(6, {
    error: "Password must be at least 6 characters long",
  }),
});
export type LoginUserDto = z.infer<typeof loginUserSchema>;
