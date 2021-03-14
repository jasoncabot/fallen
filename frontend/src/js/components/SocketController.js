import { io } from "socket.io-client";
import { socketEndpoint } from "./../Config";
import { socketAuth } from "./../models/API";

export default class SocketController {

    constructor() {
        this.socket = io(socketEndpoint, {
            path: '/ws',
            auth: socketAuth
        });
    }

    join = (gameId) => {
        this.socket.emit("game:join", gameId);
    }
}
