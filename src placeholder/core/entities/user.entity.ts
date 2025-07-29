export interface UserProps {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id || this.generateId();
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  // Business methods that return new instances (immutability)
  updateName(newName: string): User {
    return new User({
      id: this.id,
      email: this.email,
      password: this.password,
      name: newName,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  updatePassword(newPassword: string): User {
    return new User({
      id: this.id,
      email: this.email,
      password: newPassword,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  updateEmail(newEmail: string): User {
    return new User({
      id: this.id,
      email: newEmail,
      password: this.password,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  // Convert to plain object for JSON responses
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Convert to database object (includes password)
  toDatabase() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
