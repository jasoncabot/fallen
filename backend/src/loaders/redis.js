const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = async () => {
    const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
        auth_pass: process.env.REDIS_KEY,
        tls: { servername: process.env.REDIS_HOST },
        retry_strategy: (options) => {
            if (options.error && options.error.code === "ECONNREFUSED") {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error("The server refused the connection");
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error("Retry time exhausted");
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000);
        }
    });
    client.on("error", (e) => {
        console.error("Redis error: " + e);
    });
    return client;
}