import express, { Application } from "express";
import logger from "../src/shared/logger/logger-module";
import { setupStart } from "./app.js";
import { config } from "./shared/config/env/env-config";

const startServer = async () => {
  try {
    const app: Application = express();
    await setupStart(app);

    app.listen(config.PORT, () => {
      logger.infoLogger(`Server running. Port: ${config.PORT}`);
    });
  } catch (err: any) {
    logger.errorLogger("An error occured while starting the server", err);
    process.exit(1);
  }
};

startServer();
