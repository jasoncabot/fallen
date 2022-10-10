import { Events } from "phaser";

interface Command {
    timestamp: number
}

export interface CommandAction {
    action: "BOARD" | "TURN" | "DISEMBARK" | "MOVE" | "ROAD" | "WALL" | "BUILD_STRUCTURE" | "DEMOLISH" | "REPAIR" | "LAUNCH_DROPSHIP" | "ADJUST_RESEARCH" | "DISEMBARK"
    [others: string]: any; // TODO: remove this line when we have strongly typed
}

export default class CommandQueue {
    emitter: Events.EventEmitter;
    buffer: Command[];

    constructor() {
        this.emitter = new Events.EventEmitter();
        this.buffer = [] as Command[];
    }

    dispatch(command: CommandAction) {
        if (!command) return;

        console.log('Dispatching command: ' + JSON.stringify(command));
        this.buffer.push({ timestamp: new Date().getTime(), ...command });

        this.emitter.emit('commandSubmitted', command);
    }

    flush() {
        this.buffer = [];
    }
}
