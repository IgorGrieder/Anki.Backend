import { LogLevel } from "../types/types";
import { createLogger } from "./generic-logger";

export const httpLogger = createLogger(LogLevel.HTTP);
