import { LogLevel } from "../types/types";

type LogData = Record<string, unknown> | Error;

const createLogger =
  (level: LogLevel) =>
  (message: string, data?: LogData): void => {
    console.log(
      JSON.stringify(
        {
          level,
          message,
          timestamp: new Date().toISOString(),
          ...(data !== undefined && {
            data:
              data instanceof Error
                ? { message: data.message, stack: data.stack }
                : data,
          }),
        },
        null,
        2
      )
    );
  };

export default {
  infoLogger: createLogger(LogLevel.INFO),
  httpLogger: createLogger(LogLevel.HTTP),
  debugLogger: createLogger(LogLevel.DEBUG),
  errorLogger: createLogger(LogLevel.ERROR),
};
