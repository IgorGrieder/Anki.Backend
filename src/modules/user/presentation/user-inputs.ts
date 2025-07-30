import { z } from "zod";

// Input schemas for use cases
export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username cannot exceed 30 characters" }),

  email: z.email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

export const loginUserSchema = z.object({
  login: z.union([
    z.email({
      error: "Please provide a valid email address",
    }),
    z.string().min(3, {
      error: "Username must be at least 3 characters long",
    }),
  ]),
  password: z.string().min(6, {
    error: "Password must be at least 6 characters long",
  }),
});
