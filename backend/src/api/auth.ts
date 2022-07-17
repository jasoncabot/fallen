import { Request, Response } from "express";
import { Socket } from "socket.io";

import { Buffer } from "buffer";
import { UserID } from "shared";

const requireUser = (req: Request, res: Response, next: any) => {
    const token = (req.headers.authorization || "").split(' ')[1] || "";
    if (token.length == 0) {
        return res.status(403).json({ error: 'No user found' });
    }

    req.user = Buffer.from(token, 'base64').toString('ascii') as UserID;
    next();
}

const requireSocketUser = (socket: Socket, next: any) => {
    const token = socket.handshake.auth.token || "";
    if (token.length == 0) {
        return next(new Error("No user found"));
    }

    socket.user = Buffer.from(token, 'base64').toString('ascii') as UserID;
    next();
}

export { requireUser, requireSocketUser };