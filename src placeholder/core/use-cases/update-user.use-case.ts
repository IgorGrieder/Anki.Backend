import { User } from "../entities/user.entity";
import { UserRepositoryPort } from "../ports/user-repository.port";
import bcrypt from "bcrypt";

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string, updates: UpdateUserRequest): Promise<User | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("User ID is required");
    }

    // Get existing user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    // Validate updates
    this.validateUpdates(updates);

    // Check if email is being updated and if it's already taken
    if (updates.email && updates.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        updates.email
      );
      if (userWithEmail) {
        throw new Error("Email is already taken");
      }
    }

    // Create updated user
    let updatedUser = existingUser;

    if (updates.name) {
      updatedUser = updatedUser.updateName(updates.name);
    }

    if (updates.email) {
      updatedUser = new User({
        id: updatedUser.id,
        email: updates.email,
        password: updatedUser.password,
        name: updatedUser.name,
        createdAt: updatedUser.createdAt,
        updatedAt: new Date(),
      });
    }

    if (updates.password) {
      const hashedPassword = await this.hashPassword(updates.password);
      updatedUser = updatedUser.updatePassword(hashedPassword);
    }

    // Save to repository
    return this.userRepository.update(id, updatedUser);
  }

  private validateUpdates(updates: UpdateUserRequest): void {
    if (updates.email && !updates.email.includes("@")) {
      throw new Error("Invalid email address");
    }

    if (updates.password && updates.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (updates.name && updates.name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
