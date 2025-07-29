import {
  User,
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  LoginResponse,
  UserResponse,
} from "./user.types";
import * as userRepository from "./user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Validation functions
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

const isValidName = (name: string): boolean => {
  return name.trim().length > 0;
};

// Business logic functions
const validateCreateUserData = (data: CreateUserDTO): void => {
  if (!data.name || !isValidName(data.name)) {
    throw new Error("Name is required and cannot be empty");
  }

  if (!data.email || !isValidEmail(data.email)) {
    throw new Error("Valid email address is required");
  }

  if (!data.password || !isValidPassword(data.password)) {
    throw new Error("Password must be at least 6 characters long");
  }
};

const validateLoginData = (data: LoginUserDTO): void => {
  if (!data.email || !isValidEmail(data.email)) {
    throw new Error("Valid email address is required");
  }

  if (!data.password || data.password.length === 0) {
    throw new Error("Password is required");
  }
};

const checkUserExists = async (email: string): Promise<void> => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
};

const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET || "your-secret-key";
  const options = { expiresIn: 24 * 60 * 60 }; // 24 hours in seconds

  return jwt.sign(payload, secret, options);
};

const removePassword = (user: User): UserResponse => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Service functions
export const registerUser = async (
  data: CreateUserDTO
): Promise<UserResponse> => {
  validateCreateUserData(data);
  await checkUserExists(data.email);

  const user = await userRepository.createUser(data);
  return removePassword(user);
};

export const loginUser = async (data: LoginUserDTO): Promise<LoginResponse> => {
  validateLoginData(data);

  const user = await userRepository.findUserByEmail(data.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);
  const userResponse = removePassword(user);

  return {
    user: userResponse,
    token,
  };
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
  if (!id || id.trim().length === 0) {
    throw new Error("User ID is required");
  }

  const user = await userRepository.findUserById(id);
  return user ? removePassword(user) : null;
};

export const updateUser = async (
  id: string,
  updates: UpdateUserDTO
): Promise<UserResponse | null> => {
  if (!id || id.trim().length === 0) {
    throw new Error("User ID is required");
  }

  // Validate updates
  if (updates.name && !isValidName(updates.name)) {
    throw new Error("Name cannot be empty");
  }

  if (updates.email && !isValidEmail(updates.email)) {
    throw new Error("Invalid email address");
  }

  if (updates.password && !isValidPassword(updates.password)) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if email is being updated and if it's already taken
  if (updates.email) {
    const existingUser = await userRepository.findUserByEmail(updates.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error("Email is already taken");
    }
  }

  const updatedUser = await userRepository.updateUser(id, updates);
  return updatedUser ? removePassword(updatedUser) : null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  if (!id || id.trim().length === 0) {
    throw new Error("User ID is required");
  }

  return userRepository.deleteUser(id);
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const users = await userRepository.findAllUsers();
  return users.map(removePassword);
};
