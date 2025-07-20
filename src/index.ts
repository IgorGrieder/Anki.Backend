import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { httpMiddleware } from "./presentation/middleware/http-middleware.js";
import connectDB from "./infra/db/mongo/mongo.js";
import { routeMux } from "./presentation/index.js";
import { infoLogger } from "./infra/logger/info-logger.js";
import { errorLogger } from "./infra/logger/error-logger.js";

// .env config
dotenv.config({ path: "../.env" });
const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true, // Allow credentials
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      }),
    );

    // Set up middlewares and routes after DB connection is established
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    // check how the requests are snet in regards to the cookie
    app.use(cookieParser());
    app.use(httpMiddleware);

    // Set up routes
    routeMux(app);

    app.listen(PORT, () => {
      infoLogger(`Server running. Port: ${PORT}`);
    });

  } catch (err: any) {
    errorLogger("An error occured while starting the server", err);
    process.exit(1);
  }
};

startServer();
