import mongoose from "mongoose";
import { Account } from "./account-type";

const accountSchema = new mongoose.Schema<Account>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const AccountModel = mongoose.model<Account>("Users", accountSchema);

