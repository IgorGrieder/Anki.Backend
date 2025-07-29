import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Anki Cards API",
      version: "1.0.0",
    },
  },
  apis: ["**/routes.ts"],
};

export const openapiSpecification = swaggerJsdoc(options);
