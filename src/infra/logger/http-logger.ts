import { LogLevel } from "../../shared/types/types";
import { createLogger } from "./generic-logger";

export const httpLogger = createLogger(LogLevel.HTTP);
