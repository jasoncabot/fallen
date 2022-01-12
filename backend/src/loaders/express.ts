import express from 'express';
import cors from 'cors';

const load = async () => {
    const app = express();
    app.use(cors({
        origin: process.env.WS_ORIGIN
    }));
    app.use(express.json());

    app.get('/status', (_req, res) => { res.status(200).end(); });
    app.head('/status', (_req, res) => { res.status(200).end(); });
    return app;
}

export { load };