import { LogLevel } from "../../types/types";

type LogData = Record<string, unknown> | Error;

export const createLogger =
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
