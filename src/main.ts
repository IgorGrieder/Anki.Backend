import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as swaggerUi from "swagger-ui-express";

// Import middleware and config
import { mongoConnection } from "./shared/config/db/mongo";
import { httpMiddleware } from "./shared/middlewares/http-middleware";
import { openApiDocument } from "./shared/config/swagger/swagger";

// Import controllers
import {
  handleCreateUser,
  handleLoginUser,
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
  handleGetAllUsers,
} from "./domains/users/user.controller";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create Express app
const app: Application = express();

// Setup middleware
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

// Setup routes
const setupRoutes = (app: Application): void => {
  // User routes
  app.post("/api/users", handleCreateUser);
  app.post("/api/users/login", handleLoginUser);
  app.get("/api/users", handleGetAllUsers);
  app.get("/api/users/:id", handleGetUser);
  app.put("/api/users/:id", handleUpdateUser);
  app.delete("/api/users/:id", handleDeleteUser);

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
};

// Initialize application
const initializeApp = async (): Promise<void> => {
  try {
    // Connect to database
    await mongoConnection();
    console.log("✅ Connected to MongoDB");

    // Setup routes
    setupRoutes(app);
    console.log("✅ Routes configured");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
initializeApp();
