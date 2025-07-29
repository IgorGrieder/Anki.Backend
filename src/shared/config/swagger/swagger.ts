import swaggerJsdoc from "swagger-jsdoc";
import { config } from "../env/env-config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Anki Cards API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/`,
      },
    ],
  },
  apis: ["**/routes.ts"],
};

export const openapiSpecification = swaggerJsdoc(options);
