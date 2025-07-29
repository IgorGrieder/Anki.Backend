import { User } from "../entities/user.entity";
import { UserRepositoryPort } from "../ports/user-repository.port";

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<User | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("User ID is required");
    }

    return this.userRepository.findById(id);
  }
}
