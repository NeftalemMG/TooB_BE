import Redis from 'ioredis';

let redis = {
  get: async () => null,
  set: async () => null,
  del: async () => null
};

if (process.env.UPSTASH_REDIS_URL) {
  try {
    redis = new Redis(process.env.UPSTASH_REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Disable retries
      connectionTimeout: 5000,    // 5 second timeout
      enableOfflineQueue: false,
      enableReadyCheck: false,
      lazyConnect: true
    });

    redis.on('error', (error) => {
      console.error('Redis connection error:', error);
      // Reset to dummy client on error
      redis = {
        get: async () => null,
        set: async () => null,
        del: async () => null
      };
    });
  } catch (error) {
    console.error('Redis initialization error:', error);
  }
}

export { redis };

