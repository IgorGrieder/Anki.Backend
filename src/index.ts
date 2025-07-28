import logger from "../src/shared/logger/logger-module";
import { app, setupStart, PORT } from "./app.js";

const startServer = async () => {
  try {
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
