import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "../../../app";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Anki Cards API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:8081/`,
      },
    ],
  },
  apis: ["**/routes.ts"],
};

export const openapiSpecification = swaggerJsdoc(options);
