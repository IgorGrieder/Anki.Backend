import { Router } from "express";
import * as Schemas from "./user-inputs";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import * as UserHandlers from "./user-handlers";

export const createUserRouter = () => {
  const userRouter = Router();
  const path = "/users";

  /**
   * @openapi
   * /api/users/create-user:
   *   post:
   *     tags:
   *       - Users
   *     summary: Create a new user account
   *     description: Registers a new user with their email and password, sets a session cookie upon success.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: The user's email address. Must be unique.
   *                 example: jane.doe@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 description: The user's password (min 8 characters).
   *                 example: S3cureP@ssw0rd!
   *               username:
   *                 type: string
   *                 description: The user's public username (optional, must be unique if provided).
   *                 example: janedoe99
   *     responses:
   *       '201':
   *         description: User created successfully. An HTTP-only session cookie is set.
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *             description: The session cookie used for authenticating subsequent requests.
   *             example: session_token=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Strict
   *       '400':
   *         description: Validation failed. The request body contains invalid data.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation failed
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                         example: password
   *                       message:
   *                         type: string
   *                         example: Password must be at least 8 characters long
   *                       code:
   *                         type: string
   *                         example: too_small
   *       '409':
   *         description: Conflict. A user with the provided email already exists.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: A user with this email already exists.
   *       '500':
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  userRouter.post(
    `${path}/create-user`,
    genericBodyValidator(Schemas.createUserSchema),
    UserHandlers.createUserHandler
  );

  /**
   * @openapi
   * /api/users/login:
   *   post:
   *     tags:
   *       - Users
   *     summary: Log in a user
   *     description: Authenticates a user with email and password, sets a session cookie upon success.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: jane.doe@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: S3cureP@ssw0rd!
   *     responses:
   *       '200':
   *         description: Login successful. An HTTP-only session cookie is set.
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *             description: The session cookie used for authenticating subsequent requests.
   *       '400':
   *         description: Validation failed or missing credentials.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid email or password.
   *       '401':
   *         description: Unauthorized. Invalid credentials.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid email or password.
   *       '500':
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  userRouter.post(
    `${path}/login`,
    genericBodyValidator(Schemas.loginUserSchema),
    UserHandlers.loginUserHandler
  );

  /**
   * @openapi
   * /api/users/logout:
   *   post:
   *     tags:
   *       - Users
   *     summary: Log out the current user
   *     description: Logs out the user by clearing the session cookie.
   *     responses:
   *       '200':
   *         description: Logout successful. Session cookie cleared.
   *       '401':
   *         description: Unauthorized. No active session.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Not authenticated.
   *       '500':
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  userRouter.post(`${path}/logout`, UserHandlers.logoutHandler);

  /**
   * @openapi
   * /api/users/delete-user:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Delete a user account
   *     description: Deletes the authenticated user's account.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: jane.doe@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: S3cureP@ssw0rd!
   *     responses:
   *       '200':
   *         description: User deleted successfully.
   *       '400':
   *         description: Validation failed or missing credentials.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid email or password.
   *       '401':
   *         description: Unauthorized. Invalid credentials.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Not authenticated.
   *       '500':
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  userRouter.delete(
    `${path}/delete-user`,
    genericBodyValidator(Schemas.deleteUserSchema),
    UserHandlers.deleteUserHanlder
  );

  /**
   * @openapi
   * /api/users/change-password:
   *   patch:
   *     tags:
   *       - Users
   *     summary: Change user password
   *     description: Changes the authenticated user's password.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - oldPassword
   *               - newPassword
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: jane.doe@example.com
   *               oldPassword:
   *                 type: string
   *                 format: password
   *                 example: OldP@ssw0rd!
   *               newPassword:
   *                 type: string
   *                 format: password
   *                 example: NewS3cureP@ssw0rd!
   *     responses:
   *       '200':
   *         description: Password changed successfully.
   *       '400':
   *         description: Validation failed or incorrect old password.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Incorrect old password.
   *       '401':
   *         description: Unauthorized. Not authenticated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Not authenticated.
   *       '500':
   *         description: Internal Server Error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  userRouter.patch(
    `${path}/change-password`,
    genericBodyValidator(Schemas.changePasswordSchema),
    UserHandlers.changePasswordHandler
  );

  /**
   * @openapi
   * /api/users/request-password-reset:
   *   post:
   *     tags:
   *       - Users
   *     summary: Request a password reset code via email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       '204':
   *         description: Code emailed (or ignored if user not found)
   */
  userRouter.post(`${path}/request-password-reset`, genericBodyValidator(Schemas.requestPasswordResetSchema), UserHandlers.requestPasswordResetHandler);

  /**
   * @openapi
   * /api/users/perform-password-reset:
   *   post:
   *     tags:
   *       - Users
   *     summary: Perform password reset using code
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       '204':
   *         description: Password updated
   */
  userRouter.post(`${path}/perform-password-reset`, genericBodyValidator(Schemas.performPasswordResetSchema), UserHandlers.performPasswordResetHandler);

  return userRouter;
};
