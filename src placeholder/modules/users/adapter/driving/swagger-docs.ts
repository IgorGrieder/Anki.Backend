import { userDocumentSchema } from "../../core/user-entity";
import { createUserSchema } from "../../core/use-cases/dtos/create-user-dto";
import { loginUserSchema } from "../../core/use-cases/dtos/login-user-dto";

export const userSwaggerDocs = {
  "/api/user/create-user": {
    post: {
      tags: ["Users"],
      summary: "Create a new user account",
      description: "Creates a new user account with the provided information",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  minLength: 3,
                  maxLength: 30,
                  description: "Username for the account",
                },
                email: {
                  type: "string",
                  format: "email",
                  description: "Email address for the account",
                },
                password: {
                  type: "string",
                  minLength: 6,
                  description: "Password for the account",
                },
                first_name: {
                  type: "string",
                  maxLength: 50,
                  description: "User's first name",
                },
                last_name: {
                  type: "string",
                  maxLength: 50,
                  description: "User's last name",
                },
                city: {
                  type: "string",
                  maxLength: 100,
                  description: "User's city",
                },
                country: {
                  type: "string",
                  maxLength: 100,
                  description: "User's country",
                },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User created successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description:
            "Bad request - validation error or duplicate email/username",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Email/username already in use",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "An unexpected error occurred",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/user/login": {
    post: {
      tags: ["Users"],
      summary: "Login user",
      description: "Authenticates a user with email/username and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                login: {
                  type: "string",
                  description: "Email address or username",
                },
                password: {
                  type: "string",
                  minLength: 6,
                  description: "User's password",
                },
              },
              required: ["login", "password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  logged: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized - invalid credentials",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  logged: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Invalid password",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  logged: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "User was not found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  logged: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "An unexpected error occurred",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
