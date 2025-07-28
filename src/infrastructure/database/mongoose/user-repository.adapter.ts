import { User } from "../../../core/entities/user.entity";
import { UserRepositoryPort } from "../../../core/ports/user-repository.port";
import { UserModel, IUserDocument } from "./user.model";
import { createUserFromDatabase } from "../../../core/factories/user.factory";

export class MongooseUserRepositoryAdapter implements UserRepositoryPort {
  async create(user: User): Promise<User> {
    const userDocument = new UserModel({
      email: user.email,
      password: user.password,
      name: user.name,
    });

    const savedUser = await userDocument.save();
    return this.mapToEntity(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await UserModel.findById(id);
    return userDocument ? this.mapToEntity(userDocument) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ email });
    return userDocument ? this.mapToEntity(userDocument) : null;
  }

  async update(id: string, user: User): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        email: user.email,
        password: user.password,
        name: user.name,
      },
      { new: true }
    );

    return updatedUser ? this.mapToEntity(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map((user) => this.mapToEntity(user));
  }

  private mapToEntity(userDocument: IUserDocument): User {
    return createUserFromDatabase({
      _id: userDocument._id?.toString() || "",
      email: userDocument.email,
      password: userDocument.password,
      name: userDocument.name,
      createdAt: userDocument.createdAt,
      updatedAt: userDocument.updatedAt,
    });
  }
}
