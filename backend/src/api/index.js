const gamesController = require('./games');

const port = process.env.PORT;
const socketPort = process.env.WS_PORT;

module.exports.inject = async (middleware) => {
    gamesController.register(middleware);
}

module.exports.listen = async ({ express, socketio }) => {
    express.listen(port, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Listening for connections on port ${port}`);
    });

    socketio.listen(socketPort);
    console.log(`Listening for websocket connections on port ${socketPort}`);
}