import { UserID } from "shared";
import { Socket } from "socket.io";

declare global {
    namespace Express {
        interface Request {
            user?: UserID;
        }
    }
}

declare module "socket.io" {
    interface Socket {
        user?: UserID;
    }
}
