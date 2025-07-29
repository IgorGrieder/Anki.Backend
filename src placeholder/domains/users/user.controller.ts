import { Request, Response } from "express";
import * as userService from "./user.service";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "./user.types";

// Helper function to create consistent API responses
const createResponse = (success: boolean, data?: any, error?: string) => ({
  success,
  ...(data && { data }),
  ...(error && { error }),
});

// Helper function to handle errors
const handleError = (res: Response, error: any, statusCode: number = 500) => {
  console.error("Controller error:", error);
  return res
    .status(statusCode)
    .json(
      createResponse(false, undefined, error.message || "Internal server error")
    );
};

// Controller functions
export const handleCreateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: CreateUserDTO = req.body;
    const user = await userService.registerUser(userData);

    res.status(201).json(createResponse(true, user));
  } catch (error: any) {
    handleError(res, error, 400);
  }
};

export const handleLoginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loginData: LoginUserDTO = req.body;
    const result = await userService.loginUser(loginData);

    res.status(200).json(createResponse(true, result));
  } catch (error: any) {
    handleError(res, error, 401);
  }
};

export const handleGetUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json(createResponse(false, undefined, "User not found"));
      return;
    }

    res.status(200).json(createResponse(true, user));
  } catch (error: any) {
    handleError(res, error);
  }
};

export const handleUpdateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateUserDTO = req.body;

    const user = await userService.updateUser(id, updates);

    if (!user) {
      res.status(404).json(createResponse(false, undefined, "User not found"));
      return;
    }

    res.status(200).json(createResponse(true, user));
  } catch (error: any) {
    handleError(res, error, 400);
  }
};

export const handleDeleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      res.status(404).json(createResponse(false, undefined, "User not found"));
      return;
    }

    res
      .status(200)
      .json(createResponse(true, { message: "User deleted successfully" }));
  } catch (error: any) {
    handleError(res, error);
  }
};

export const handleGetAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(createResponse(true, users));
  } catch (error: any) {
    handleError(res, error);
  }
};
