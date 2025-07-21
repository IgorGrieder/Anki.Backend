import { LogLevel } from "../../shared/types/types";
import { createLogger } from "./generic-logger";

export const errorLogger = createLogger(LogLevel.ERROR);
