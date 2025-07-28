export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Functional error creators
export const createValidationError = (message: string): ValidationError =>
  new ValidationError(message);

export const createNotFoundError = (message: string): NotFoundError =>
  new NotFoundError(message);

export const createAuthenticationError = (
  message: string
): AuthenticationError => new AuthenticationError(message);
