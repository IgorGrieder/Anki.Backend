import { User } from "../entities/user.entity";
import { UserRepositoryPort } from "../ports/user-repository.port";
import { CreateUserRequest } from "../ports/user-service.port";
import { createValidationError } from "../utils/errors";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(request: CreateUserRequest): Promise<User> {
    // Validate input
    this.validateRequest(request);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw createValidationError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(request.password);

    // Create user entity
    const user = new User({
      email: request.email,
      password: hashedPassword,
      name: request.name,
    });

    // Save to repository
    return this.userRepository.create(user);
  }

  private validateRequest(request: CreateUserRequest): void {
    if (!request.email || !request.email.includes("@")) {
      throw createValidationError("Invalid email address");
    }

    if (!request.password || request.password.length < 6) {
      throw createValidationError(
        "Password must be at least 6 characters long"
      );
    }

    if (!request.name || request.name.trim().length === 0) {
      throw createValidationError("Name is required");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
