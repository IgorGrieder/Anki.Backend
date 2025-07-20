export type Result<TSuccess, TError> = { kind: 'success'; value: TSuccess } | { kind: 'error'; error: TError };
