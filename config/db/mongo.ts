import mongoose from "mongoose";
import logger from "../../src/shared/logger/logger-module";

export const mongoConnection = async () => {
  const connectionString: string = process.env.DB_STRING ?? "";
  try {
    await mongoose.connect(connectionString);
    logger.infoLogger("MongoDB coonection stablished");
  } catch (err) {
    if (err instanceof Error) {
      logger.errorLogger("MongoDB connection failed", err);
      throw new Error(err.message);
    }
  }
};
