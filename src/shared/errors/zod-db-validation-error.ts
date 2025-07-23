import { ZodSafeParseError } from "zod";

export class ZodDBValidationError<T> extends Error {
  constructor(result: ZodSafeParseError<T>) {
    const message = `Database data validation failed: ${result.error.issues
      .map((e) => `${e.path.join(".")} (${e.message})`)
      .join(", ")}`;

    super(message);

    this.name = "ZodDBValidationError";

    // This helps maintain a clean stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodDBValidationError);
    }
  }
}
