export default class SocketController {
    // Placeholder for future real-time integration.
    // Current client flow is request/response driven.
    private readonly connected: boolean;

    constructor() {
        this.connected = false;
    }

    join = (_gameId: string): void => {
        if (!this.connected) {
            return;
        }
    }
}
