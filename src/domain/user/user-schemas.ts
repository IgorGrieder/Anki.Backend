import { z } from "zod";

// --- Zod Schema for Full User Document (as retrieved from DB) ---
export const userDocumentSchema = z.object({
  _id: z.any().transform((val) => val.toString()),
  username: z.string().min(3).max(30).optional(),
  email: z.email(),
  password_hash: z.string().optional(),
  email_confirmed: z.boolean().default(false),

  google_id: z.string().optional(),
  google_access_token: z.string().optional(),
  google_refresh_token: z.string().optional(),

  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),

  membership_type: z.enum(["free", "premium", "pro"]).default("free"),
  membership_expires_at: z.date().optional(),

  is_active: z.boolean().default(true),
  last_login_at: z.date().optional(),

  created_at: z.date(), // Mongoose timestamps
  updated_at: z.date(), // Mongoose timestamps
});

// --- Zod Schema for User Creation (Initial Data from Client) ---
// TO-DO for OAuth then make another schema to validate user data from another endpoint
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

export const loginSchema = z.object({
  login: z.union([
    z.email({
      error: "Please provide a valid email address",
    }),
    z.string().min(6, {
      error: "Password must be at least 6 characters long",
    }),
  ]),
  username: z.string().min(3, {
    error: "Username must be at least 3 characters long",
  }),
});
