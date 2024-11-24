import { redis } from './lib/redis.js';

const testRedis = async () => {
    try {
        console.log('Testing Redis connection...');
        
        // Test basic connectivity
        const pingResult = await redis.ping();
        console.log('Ping result:', pingResult);

        // Test set and get
        await redis.set('test_key', 'test_value');
        const value = await redis.get('test_key');
        console.log('Set/Get test:', value === 'test_value' ? 'PASSED' : 'FAILED');

        // Clean up
        await redis.del('test_key');
        console.log('Redis tests completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Redis test failed:', error);
        process.exit(1);
    }
};

testRedis();