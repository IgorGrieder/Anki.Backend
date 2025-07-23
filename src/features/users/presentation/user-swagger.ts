import { OpenAPIV3 } from "openapi-types";
import { commonResponses } from "../../../shared/infra/swagger/components";

const createUserSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 3,
      maxLength: 30,
      example: "jane_doe",
      description: "Optional. Must be unique if provided.",
    },
    email: {
      type: "string",
      format: "email",
      example: "jane.doe@example.com",
    },
    password: {
      type: "string",
      format: "password",
      minLength: 6,
      example: "Str0ngP@ssw0rd!",
    },
    first_name: {
      type: "string",
      maxLength: 50,
      example: "Jane",
    },
    last_name: {
      type: "string",
      maxLength: 50,
      example: "Doe",
    },
    city: {
      type: "string",
      maxLength: 100,
      example: "San Francisco",
    },
    country: {
      type: "string",
      maxLength: 100,
      example: "USA",
    },
  },
  required: ["email", "password"],
};

const path = "/api/auth";

export const userPaths: OpenAPIV3.PathsObject = {
  [`${path}/create-user`]: {
    post: {
      tags: ["Authentication"],
      summary: "Create a new user account",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: createUserSchema,
          },
        },
      },
      responses: {
        "201": {
          description: "Account created successfully. A JWT cookie is set.",
          headers: {
            "Set-Cookie": {
              schema: {
                type: "string",
                example:
                  "jwt=your-token-here; Max-Age=86400; Path=/; HttpOnly; SameSite=Strict",
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
};
