import { UserService } from "../../application/services/user.service";
import { MongooseUserRepositoryAdapter } from "../database/mongoose/user-repository.adapter";
import { UserController } from "../http/controllers/user.controller";
import { createUserRoutes } from "../http/routes/user.routes";

export class Container {
  private static instance: Container;
  private userRepository!: MongooseUserRepositoryAdapter;
  private userService!: UserService;
  private userController!: UserController;

  private constructor() {
    this.initializeDependencies();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeDependencies(): void {
    // Initialize repository (adapter)
    this.userRepository = new MongooseUserRepositoryAdapter();

    // Initialize service with repository dependency
    this.userService = new UserService(this.userRepository);

    // Initialize controller with service dependency
    this.userController = new UserController(this.userService);
  }

  public getUserRepository(): MongooseUserRepositoryAdapter {
    return this.userRepository;
  }

  public getUserService(): UserService {
    return this.userService;
  }

  public getUserController(): UserController {
    return this.userController;
  }

  public getUserRoutes() {
    return createUserRoutes(this.userController);
  }
}
