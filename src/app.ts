import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { mongoConnection } from "./shared/config/db/mongo";
import { httpMiddleware } from "./shared/middlewares/http-middleware";
import { createUserRouter } from "./modules/user/presentation/routes";
import { createCollectionRouter } from "./modules/collections/presentation/routes";
import { createQuestionsRouter } from "./modules/questions/presentation/routes";
import swaggerUi from "swagger-ui-express";
import { openapiSpecification } from "./shared/config/swagger/swagger";
import { config } from "./shared/config/env/env-config";
import { startMailWorker } from "./shared/infra/queue/mail-queue";

export const setupStart = async (app: Application) => {
  await mongoConnection();

  app.use(
    cors({
      origin: [`http://localhost:${config.PORT}`, "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cookieParser());
  app.use(httpMiddleware);

  app.use("/api", createUserRouter());
  app.use("/api", createCollectionRouter());
  app.use("/api", createQuestionsRouter());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

  // Email worker
  void startMailWorker();
};
