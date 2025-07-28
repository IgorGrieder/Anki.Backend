import { UserRepositoryPort } from "../ports/user-repository.port";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error("User ID is required");
    }

    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return false;
    }

    // Delete user
    return this.userRepository.delete(id);
  }
}
