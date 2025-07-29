import express, { Application } from "express";
import logger from "../src/shared/logger/logger-module";
import { setupStart, PORT } from "./app.js";

const startServer = async () => {
  try {
    const app: Application = express();
    await setupStart(app);

    app.listen(PORT, () => {
      logger.infoLogger(`Server running. Port: ${PORT}`);
    });
  } catch (err: any) {
    logger.errorLogger("An error occured while starting the server", err);
    process.exit(1);
  }
};

startServer();
