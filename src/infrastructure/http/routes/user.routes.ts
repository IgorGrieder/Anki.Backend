import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // POST /api/users - Create a new user
  router.post("/", (req, res) => userController.createUser(req, res));

  // POST /api/users/login - Login user
  router.post("/login", (req, res) => userController.loginUser(req, res));

  // GET /api/users/:id - Get user by ID
  router.get("/:id", (req, res) => userController.getUserById(req, res));

  // PUT /api/users/:id - Update user
  router.put("/:id", (req, res) => userController.updateUser(req, res));

  // DELETE /api/users/:id - Delete user
  router.delete("/:id", (req, res) => userController.deleteUser(req, res));

  return router;
}
