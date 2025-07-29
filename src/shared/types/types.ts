type Result<TSuccess, TError> =
  | { kind: "success"; value: TSuccess }
  | { kind: "error"; error: TError };

enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
  HTTP = "HTTP",
}

interface GenericError {
  code: number;
  msg: string;
}

interface GenericSuccess {
  code: number;
}

export { Result, LogLevel, GenericSuccess, GenericError };
