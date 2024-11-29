// import Redis from 'ioredis';

// const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// export default redis;

import Redis from 'ioredis';

let redis;

try {
  if (process.env.UPSTASH_REDIS_URL) {
    redis = new Redis(process.env.UPSTASH_REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('Redis retry limit reached, falling back to no-cache mode');
          return null;
        }
        return Math.min(times * 50, 2000);
      },
      connectionTimeout: 10000
    });
  }
} catch (error) {
  console.error('Redis connection error:', error);
  // Fallback for when Redis is unavailable
  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null
  };
}

export { redis };