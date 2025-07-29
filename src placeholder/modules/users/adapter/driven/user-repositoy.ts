import { CreateUserDto } from "../../core/use-cases/dtos/create-user-dto";
import { User } from "../../core/user-entity";
import { IUserRepository } from "../../port/driven/user-repository";
import { UserModel } from "./mongoose/user-model";

export const createUserRepository = (): IUserRepository => {
  return {
    async createUser(user: CreateUserDto): Promise<User | null> {
      try {
        const createdUser = await UserModel.create(user);
        return createdUser.toObject();
      } catch (error) {
        return null;
      }
    },

    async findByEmailOrUsername(login: string): Promise<User | null> {
      try {
        const user = await UserModel.findOne({
          $or: [{ username: login }, { email: login }],
        }).lean();
        return user;
      } catch (error) {
        return null;
      }
    },

    async findByEmail(email: string): Promise<User | null> {
      try {
        const user = await UserModel.findOne({ email }).lean();
        return user;
      } catch (error) {
        return null;
      }
    },

    async findById(id: string): Promise<User | null> {
      try {
        const user = await UserModel.findById(id).lean();
        return user;
      } catch (error) {
        return null;
      }
    },

    async updateLastLogin(userId: string): Promise<void> {
      try {
        await UserModel.findByIdAndUpdate(userId, {
          last_login_at: new Date(),
        });
      } catch (error) {
        // Log error but don't throw to avoid breaking the login flow
        console.error("Error updating last login:", error);
      }
    },

    async updateUser(
      userId: string,
      updates: Partial<User>
    ): Promise<User | null> {
      try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
          new: true,
        }).lean();
        return updatedUser;
      } catch (error) {
        return null;
      }
    },

    async deleteUser(userId: string): Promise<boolean> {
      try {
        const result = await UserModel.findByIdAndDelete(userId);
        return result !== null;
      } catch (error) {
        return false;
      }
    },
  };
};
