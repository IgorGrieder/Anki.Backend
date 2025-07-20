import { OpenAPIV3 } from "openapi-types";

export const ErrorSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

export const commonResponses: OpenAPIV3.ResponsesObject = {
  "400": {
    description: "Bad Request. Proper input was not given.",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  "500": {
    description: "Internal Server Error.",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
};
