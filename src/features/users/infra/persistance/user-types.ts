import mongoose, { Types } from "mongoose";

// ------------------- User Document return
export interface IUser extends mongoose.Document {
  _id: Types.ObjectId;
  username?: string;
  email: string;
  password_hash?: string;
  email_confirmed: boolean;
  google_id?: string; // Optional for non-Google OAuth users
  google_access_token?: string; // Optional and select: false
  google_refresh_token?: string; // Optional and select: false
  first_name?: string;
  last_name?: string;
  city?: string;
  country?: string;
  membership_type: "free" | "premium" | "pro";
  membership_expires_at?: Date;
  is_active: boolean;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}
