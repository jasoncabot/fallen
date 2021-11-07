import { createClient } from 'redis';

const load = async () => {

    const { REDIS_HOST, REDIS_PORT, REDIS_KEY } = process.env;
    const url = `redis://default:${REDIS_KEY}@${REDIS_HOST}:${REDIS_PORT}`;
    const client = createClient({ url });

    client.on('warning', (err: any) => console.log('Redis warning', err));
    client.on('error', (err: any) => console.log('Redis error', err));

    await client.connect();

    return client;
};

export { load };
