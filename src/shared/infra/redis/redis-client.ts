import Redis from "ioredis";

let redisClient: Redis | null = null;

export const getRedis = (): Redis => {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL;
  if (url) {
    redisClient = new Redis(url);
  } else {
    const host = process.env.REDIS_HOST || "127.0.0.1";
    const port = Number(process.env.REDIS_PORT || 6379);
    redisClient = new Redis({ host, port });
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
