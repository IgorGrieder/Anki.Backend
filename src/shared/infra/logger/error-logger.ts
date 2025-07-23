import { LogLevel } from "../../types/types";
import { createLogger } from "./generic-logger";

export const errorLogger = createLogger(LogLevel.ERROR);
