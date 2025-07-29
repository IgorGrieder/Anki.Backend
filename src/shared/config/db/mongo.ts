import mongoose from "mongoose";
import logger from "../../logger/logger-module";
import { config } from "../env/env-config";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(config.MONGO_STRING);
    logger.infoLogger("MongoDB coonection stablished");
  } catch (err) {
    if (err instanceof Error) {
      logger.errorLogger("MongoDB connection failed", err);
      throw new Error(err.message);
    }
  }
};
