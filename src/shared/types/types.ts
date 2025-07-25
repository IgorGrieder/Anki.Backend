export type Result<TSuccess, TError> =
  | { kind: "success"; value: TSuccess }
  | { kind: "error"; error: TError };

export enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
  HTTP = "HTTP",
}

export interface GenericError {
  code: number;
  msg: string;
}

export interface GenericSuccess {
  code: number;
}
