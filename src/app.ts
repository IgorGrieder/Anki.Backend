import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { mongoConnection } from "./shared/infra/persistance/mongo/mongo";
import { httpMiddleware } from "./shared/middlewares/http-middleware";
import dotenv from "dotenv";
import * as swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./shared/infra/swagger/swagger";
import { userRouter } from "./features/users/presentation";

dotenv.config();
export const PORT = process.env.PORT;

export const app: Application = express();

export const setupStart = async (app: Application) => {
  await mongoConnection();

  app.use(
    cors({
      origin: `http://localhost:${PORT}`,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cookieParser());
  app.use(httpMiddleware);

  // RoutesMux
  /*  app.use("/api/cards", cardRoutes); */
  /* app.use("/api/collections", collectionRoutes) */
  app.use(userRouter);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
};
