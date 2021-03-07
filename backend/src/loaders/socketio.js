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

    io.on("connection", socket => {
        console.log('client connected');
    });
    io.on("disconnect", reason => {
        console.log('client disconnected');
    });

    return io;
}