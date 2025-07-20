import { infoLogger } from "./infra/logger/info-logger.js";
import { errorLogger } from "./infra/logger/error-logger.js";
import { app, setupStart, PORT } from "./app.js";

const startServer = async () => {
  try {
    await setupStart(app);

    app.listen(PORT, () => {
      infoLogger(`Server running. Port: ${PORT}`);
    });

  } catch (err: any) {
    errorLogger("An error occured while starting the server", err);
    process.exit(1);
  }
};

startServer();
