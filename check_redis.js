const redis = require('redis');
let redisClient;

(async () => {
    redisClient = await redis.createClient({
        socket: {
          host: 'localhost',
          port: 6379
        },
        database: 0})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  
})();