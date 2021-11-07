For testing you can spin up a local Redis instance

```bash
docker run -d -it --rm --name local-redis -p 6280:6379 redis:6.2 --requirepass "password123"
```

and use the following configuration in `.env`

```bash
REDIS_HOST=localhost
REDIS_KEY=password123
REDIS_PORT=6280
PORT=4500
WS_PORT=3500
WS_ORIGIN=http://localhost:8080
```