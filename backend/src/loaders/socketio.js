const auth = require('./../api/auth');
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
    const io = require("socket.io")(options);

    io.use(auth.requireSocketUser);

    return io;
}