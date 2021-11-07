import { register } from './games';

const { PORT, WS_PORT } = process.env;

const inject = async (middleware: any) => {
    register(middleware);
}

const listen = async (middleware: any) => {
    const { express, socketio } = middleware;
    express.listen(PORT, (err: Error) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Listening for connections on port ${PORT}`);
    });

    socketio.listen(WS_PORT);
    console.log(`Listening for websocket connections on port ${WS_PORT}`);
}

export { inject, listen };