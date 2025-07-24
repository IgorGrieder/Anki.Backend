const isDuplicateKeyError = (err: any): boolean => err?.code === 11000;

export { isDuplicateKeyError };
