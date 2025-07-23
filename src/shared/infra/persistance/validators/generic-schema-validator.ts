import { ZodType } from "zod";
import { ZodDBValidationError } from "../../../errors/zod-db-validation-error";

export function validateWithSchema<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new ZodDBValidationError(result);
  return result.data;
}
