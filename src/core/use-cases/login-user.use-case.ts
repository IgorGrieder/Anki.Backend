import { User } from "../entities/user.entity";
import { UserRepositoryPort } from "../ports/user-repository.port";
import { LoginUserRequest } from "../ports/user-service.port";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(
    request: LoginUserRequest
  ): Promise<{ user: User; token: string }> {
    // Validate input
    this.validateRequest(request);

    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  private validateRequest(request: LoginUserRequest): void {
    if (!request.email || !request.email.includes("@")) {
      throw new Error("Invalid email address");
    }

    if (!request.password || request.password.length === 0) {
      throw new Error("Password is required");
    }
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET || "your-secret-key";
    const options = { expiresIn: 24 * 60 * 60 }; // 24 hours in seconds

    return jwt.sign(payload, secret, options);
  }
}
