import { Express } from "express";
import { Server } from "socket.io";

interface Middleware {
    express: Express;
    redis: any;
    socketio: Server;
}

export {
    Middleware
}