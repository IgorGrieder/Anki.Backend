import { LogLevel } from "../../types/types";
import { createLogger } from "./generic-logger";

export const debugLogger = createLogger(LogLevel.DEBUG);
