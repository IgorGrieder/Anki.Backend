import mongoose from "mongoose";
import { infoLogger } from "../../logger/info-logger";
import { errorLogger } from "../../logger/error-logger";

export const mongoConnection = async () => {
  const connectionString: string = process.env.DB_STRING ?? "";
  try {
    await mongoose.connect(connectionString);
    infoLogger("MongoDB coonection stablished");
  } catch (err) {
    if (err instanceof Error) {
      errorLogger("MongoDB connection failed", err);
      throw new Error(err.message);
    }
  }
};
