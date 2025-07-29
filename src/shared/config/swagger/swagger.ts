import swaggerJsdoc from "swagger-jsdoc";

const options = {
  openapi: "3.0.0",
  info: {
    title: "Anki Cards API",
    version: "1.0.0",
  },
  apis: ["./src/routes*.js"],
};

export const openapiSpecification = swaggerJsdoc(options);
