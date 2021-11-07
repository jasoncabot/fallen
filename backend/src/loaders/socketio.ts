import { Server } from "socket.io";
import { requireSocketUser } from "../api/auth";

const options = {
    serveClient: false,
    cookie: false,
    path: '/ws',
    cors: {
        origin: process.env.WS_ORIGIN,
        methods: ["GET", "POST"]
    }
};

const load = async () => {
    const io = new Server(options);

    io.use(requireSocketUser);

    return io;
}

export { load };