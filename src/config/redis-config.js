const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URI           //'redis://127.0.0.1:6379'
});

redisClient.on('connect', () => {
    console.log("Redis connected");
});

redisClient.on('error', (err) => {
    console.log("Redis connection error:", err);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

module.exports = { redisClient };