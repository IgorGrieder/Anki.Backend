import { LogLevel } from "../../shared/types/types";
import { createLogger } from "./generic-logger";

export const debugLogger = createLogger(LogLevel.DEBUG);
