import { LogLevel } from "../../types/types";
import { createLogger } from "./generic-logger";

export const infoLogger = createLogger(LogLevel.INFO);
