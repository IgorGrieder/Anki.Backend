import { ZodError, ZodSafeParseError } from "zod";

export class ZodDBValidationError<T> extends Error {
  public readonly issues: ZodError["issues"];

  constructor(result: ZodSafeParseError<T>) {
    const message = `Database data validation failed: ${result.error.issues
      .map((e) => `${e.path.join(".")} (${e.message})`)
      .join(", ")}`;

    super(message);

    this.name = "ZodDBValidationError";
    this.issues = result.error.issues;

    // This helps maintain a clean stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodDBValidationError);
    }
  }
}
