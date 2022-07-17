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

    // shutdown handling
    const onShutdownReceived = () => {
        if (express.listening) {
            express.close((err: any) => {
                if (err) {
                    console.error(err)
                    return process.exit(1)
                }
            });
        }
        process.on('SIGINT', () => {
            socketio.sockets.send(JSON.stringify({
                kind: 'SERVER-SHUTDOWN'
            }));
        });

        process.exit(0);
    }

    process.on('SIGINT', onShutdownReceived);
    process.on('SIGTERM', onShutdownReceived);
    process.on('SIGHUP', onShutdownReceived);

}

export { inject, listen };