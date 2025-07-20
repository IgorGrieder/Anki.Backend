import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { mongoConnection } from './infra/db/mongo/mongo';
import { routeMux } from './presentation';
import { httpMiddleware } from './presentation/middleware/http-middleware';
import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT;

export const app: Application = express();

export const setupStart = async (app: Application) => {
  await mongoConnection();

  app.use(
    cors({
      origin: `http://localhost:${PORT}`,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());
  app.use(httpMiddleware);

  routeMux(app);
};
