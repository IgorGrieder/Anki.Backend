import { ZodType } from "zod";
import { ZodDBValidationError } from "../../shared/errors/zod-db-validation-error";

export function validateWithSchema<T>(schema: ZodType<T>, data: T): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new ZodDBValidationError(result);
  return result.data;
}
