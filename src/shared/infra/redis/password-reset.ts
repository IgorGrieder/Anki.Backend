import { getRedis } from "./redis-client";

const CODE_PREFIX = "reset_code:";

export const saveResetCode = async (code: string, userId: string, ttlSeconds: number) => {
  const client = getRedis();
  await client.setex(CODE_PREFIX + code, ttlSeconds, userId);
};

export const getUserIdByResetCode = async (code: string): Promise<string | null> => {
  const client = getRedis();
  return await client.get(CODE_PREFIX + code);
};

export const deleteResetCode = async (code: string): Promise<void> => {
  const client = getRedis();
  await client.del(CODE_PREFIX + code);
};
