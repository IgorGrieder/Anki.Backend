import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { mongoConnection } from "./shared/config/db/mongo";
import { httpMiddleware } from "./shared/middlewares/http-middleware";
import dotenv from "dotenv";
import * as swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./shared/config/swagger/swagger";
import { Container } from "./infrastructure/di/container";

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

  // Initialize dependency injection container
  const container = Container.getInstance();

  // Setup routes using hexagonal architecture
  app.use("/api/users", container.getUserRoutes());

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
};
