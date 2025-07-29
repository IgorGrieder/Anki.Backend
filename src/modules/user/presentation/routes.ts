import { Router } from "express";
import { createUserSchema, loginUserSchema } from "./user-inputs";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import * as UserHandlers from "./user-handlers";

export const createUserRouter = () => {
  const userRouter = Router();
  const path = "/user";

  /**
   * @openapi
   * /users/create-user:
   * post:
   * tags:
   * - Users
   * summary: Create a new user account
   * description: Registers a new user with their email and password, sets a session cookie upon success.
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * required:
   * - email
   * - password
   * properties:
   * email:
   * type: string
   * format: email
   * description: The user's email address. Must be unique.
   * example: jane.doe@example.com
   * password:
   * type: string
   * format: password
   * description: The user's password (min 8 characters).
   * example: 'S3cureP@ssw0rd!'
   * username:
   * type: string
   * description: The user's public username (optional, must be unique if provided).
   * example: janedoe99
   * responses:
   * '201':
   * description: User created successfully. An HTTP-only session cookie is set.
   * headers:
   * Set-Cookie:
   * schema:
   * type: string
   * example: 'session_token=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Strict'
   * description: The session cookie used for authenticating subsequent requests.
   * '400':
   * description: Validation failed. The request body contains invalid data.
   * content:
   * application/json:
   * schema:
   * type: object
   * properties:
   * message:
   * type: string
   * example: Validation failed
   * errors:
   * type: array
   * items:
   * type: object
   * properties:
   * path:
   * type: string
   * example: password
   * message:
   * type: string
   * example: Password must be at least 8 characters long
   * code:
   * type: string
   * example: too_small
   * '409':
   * description: Conflict. A user with the provided email already exists.
   * content:
   * application/json:
   * schema:
   * type: object
   * properties:
   * message:
   * type: string
   * example: A user with this email already exists.
   * '500':
   * description: Internal Server Error.
   * content:
   * application/json:
   * schema:
   * type: object
   * properties:
   * message:
   * type: string
   * example: An unexpected error occurred.
   */
  userRouter.post(
    `${path}/create-user`,
    genericBodyValidator(createUserSchema),
    UserHandlers.createUserHandler
  );

  userRouter.post(
    `${path}/login`,
    genericBodyValidator(loginUserSchema),
    UserHandlers.loginUserHandler
  );

  return userRouter;
};
