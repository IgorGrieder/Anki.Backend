import { LogLevel } from "../../shared/types/types";
import { createLogger } from "./generic-logger";

export const infoLogger = createLogger(LogLevel.INFO);
