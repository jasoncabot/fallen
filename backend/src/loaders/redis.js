const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = async () => {
    const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
        auth_pass: process.env.REDIS_KEY,
        tls: { servername: process.env.REDIS_HOST }
    });
    client.on("error", (e) => {
        console.error("Redis error: " + e);
    });
    return client;
}