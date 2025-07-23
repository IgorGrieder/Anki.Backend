import { OpenAPIV3 } from "openapi-types";
import { userPaths } from "../../../features/users/presentation/user-swagger";
import { ErrorSchema } from "./components";

export const openApiDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Anki Cards API",
    version: "1.0.0",
  },
  paths: {
    ...userPaths,
  },
  components: {
    schemas: {
      Error: ErrorSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
