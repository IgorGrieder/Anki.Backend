import { z } from "zod";
import {
  changePasswordSchema,
  createUserSchema,
  deleteUserSchema,
  loginUserSchema,
} from "../presentation/user-inputs";

// Documents types
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

export type UserDocument = z.infer<typeof userDocumentSchema>;
export type User = Readonly<UserDocument>;

// Inputs -----------------------------------------------------
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type PasswordChangeInput = z.infer<typeof changePasswordSchema>;
