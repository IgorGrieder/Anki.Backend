import mongoose from "mongoose";
import { UserDocument } from "../user-types";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
    password_hash: {
      type: String, // Not required with OAuth
    },

    email_confirmed: {
      type: Boolean,
      default: false,
    },

    // --- OAuth (Google) Specific Fields ---
    google_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Google access token (store only if you need to make ongoing API calls to Google
    // on behalf of the user). Make sure to handle security for this token.
    google_access_token: {
      type: String,
      select: false,
    },
    // Google refresh token (for obtaining new access tokens without user re-authentication).
    google_refresh_token: {
      type: String,
      select: false,
    },

    // --- User Profile Information ---
    first_name: {
      type: String,
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    last_name: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, "Country name cannot exceed 100 characters"],
    },

    // --- Membership/Subscription Information ---
    membership_type: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free",
      required: true,
    },
    membership_expires_at: {
      type: Date,
    },
    // --- Account Status and Timestamps ---
    is_active: {
      type: Boolean,
      default: true,
    },
    last_login_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// --- Schema Indexes for Performance ---
// Create indexes on fields that are frequently queried to improve performance.
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ google_id: 1 });

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
