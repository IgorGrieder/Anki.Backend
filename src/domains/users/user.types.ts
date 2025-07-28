// Core user entity
export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

// Data Transfer Objects
export type CreateUserDTO = {
  email: string;
  password: string;
  name: string;
};

export type LoginUserDTO = {
  email: string;
  password: string;
};

export type UpdateUserDTO = {
  name?: string;
  email?: string;
  password?: string;
};

// Response types
export type LoginResponse = {
  user: Omit<User, "password">;
  token: string;
};

export type UserResponse = Omit<User, "password">;

// Repository types
export type UserRepository = {
  create: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => Promise<User>;
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  update: (id: string, updates: Partial<User>) => Promise<User | null>;
  delete: (id: string) => Promise<boolean>;
  findAll: () => Promise<User[]>;
};
