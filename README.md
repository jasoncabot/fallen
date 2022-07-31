# Fallen Haven

This is an attempt to make a modern web-based version of the 1997 game, Fallen Haven.

## Running Locally

The game is built in two halves. The frontend, written in Javascript using the excellent [Phaser](https://phaser.io/) framework and a backend Node and express web server.

Both can be run independently with or without the other.

To run the frontend locally you must set the appropriate environment variables in a file `./frontend/.env`

```bash
API_ENDPOINT=http://localhost:4500
ASSET_ENDPOINT=/assets/data
WEBGL_RENDERER=true
CANVAS_RENDERER=true
```

Then you can run the frontend with a standard `npm start`

```bash
cd frontend
npm install
npm start
```

The backend connects to a Redis instance for persistent (ish) storage. You'll need to again set the appropriate values in `./backend/.env` such as


```bash
REDIS_HOST=redis.host.dns.name
REDIS_KEY=access.key
REDIS_PORT=6280
PORT=4500
```

Then you can run the backend with either `npm start` to run without reloading or `npm run start:dev` if you want the server to hot-reload with changes.

```bash
cd backend
npm install
npm run start:dev
```


![Fallen Haven Example](./docs/img/fallen-haven-example.jpg)

## Production Deployment

The Javascript frontend is built using [webpack](./frontend/config/webpack.prod.js) to produce a static bundle that can be deployed to any CDN.

The game is [currently running](https://fallenhaven.jasoncabot.me) on Azure Kubernetes Service.

It's a static nginx server [configured](./frontend/nginx.conf) to serve a static website where the Kubernetes Deployment, Service and Ingress are defined in this [manifest](./manifests/frontend.yaml)

Everything is deployed automatically using [GitHub Actions](./.github/workflows/build-deploy-frontend.yml) and an Azure Service Principal

The backend is built using standard Node and an express web server which is bundled into a Docker image before being deployed to the same Kubernetes cluster as the frontend.
