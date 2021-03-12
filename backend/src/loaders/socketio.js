const gamesController = require('./../api/games');

const options = {
    serveClient: false,
    cookie: false,
    path: '/ws',
    cors: {
        origin: process.env.WS_ORIGIN,
        methods: ["GET", "POST"]
    }
};

module.exports = async () => {
    return require("socket.io")(options);
}