const redis = require('redis');
const initializeRedis = async () => {
    const redisClient = redis.createClient({
        socket: {
            host: 'redis',
        },
    })
    redisClient.on('error', err => console.log('Redis Client Error', err))
    await redisClient.connect();
    return redisClient;
}
module.exports = {
    initializeRedis
};