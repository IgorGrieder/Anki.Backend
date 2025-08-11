import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MONGO_STRING: process.env.MONGO_STRING ?? "",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_SECURE: process.env.SMTP_SECURE,
  MAIL_FROM: process.env.MAIL_FROM,
};
