import { User, UserRepository, CreateUserDTO } from "./user.types";
import {
  UserModel,
  IUserDocument,
} from "../../infrastructure/database/mongoose/user.model";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

// Helper function to map database document to domain entity
const mapToUser = (doc: IUserDocument): User => ({
  id: doc._id?.toString() || "",
  email: doc.email,
  password: doc.password,
  name: doc.name,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Repository implementation
export const createUser = async (data: CreateUserDTO): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);

  const userDoc = new UserModel({
    email: data.email,
    password: hashedPassword,
    name: data.name,
  });

  const savedUser = await userDoc.save();
  return mapToUser(savedUser);
};

export const findUserById = async (id: string): Promise<User | null> => {
  const userDoc = await UserModel.findById(id);
  return userDoc ? mapToUser(userDoc) : null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const userDoc = await UserModel.findOne({ email });
  return userDoc ? mapToUser(userDoc) : null;
};

export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User | null> => {
  const updateData: any = {};

  if (updates.name) updateData.name = updates.name;
  if (updates.email) updateData.email = updates.email;
  if (updates.password) {
    updateData.password = await hashPassword(updates.password);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  return updatedUser ? mapToUser(updatedUser) : null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await UserModel.findByIdAndDelete(id);
  return result !== null;
};

export const findAllUsers = async (): Promise<User[]> => {
  const users = await UserModel.find();
  return users.map(mapToUser);
};

// Export repository object
export const userRepository: UserRepository = {
  create: createUser,
  findById: findUserById,
  findByEmail: findUserByEmail,
  update: updateUser,
  delete: deleteUser,
  findAll: findAllUsers,
};
