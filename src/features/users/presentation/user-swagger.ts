import { OpenAPIV3 } from "openapi-types";
import { commonResponses } from "../../../../config/swagger/components";

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

const loginUserSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    login: {
      type: "string",
      description: "Username or email address.",
      example: "jane.doe@example.com",
    },
    password: {
      type: "string",
      format: "password",
      minLength: 6,
      example: "Str0ngP@ssw0rd!",
    },
  },
  required: ["login", "password"],
};

const userPath = "/api/user";

export const userPaths: OpenAPIV3.PathsObject = {
  [`${userPath}/create-user`]: {
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
  [`${userPath}/login`]: {
    post: {
      tags: ["Authentication"],
      summary: "Login with username or email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: loginUserSchema,
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful. JWT cookie is set.",
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
        "401": {
          description: "Invalid credentials.",
        },
        "404": {
          description: "User not found.",
        },
        ...commonResponses,
      },
    },
  },
};
