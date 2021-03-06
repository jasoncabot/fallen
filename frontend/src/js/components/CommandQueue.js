const EventEmitter = require('eventemitter3');

export default class CommandQueue {

    constructor() {
        this.emitter = new EventEmitter();
        this.buffer = [];
    }

    dispatch(command) {
        if (!command) return;

        console.log('Dispatching command: ' + JSON.stringify(command));
        this.buffer.push({ timestamp: new Date().getTime(), ...command });

        this.emitter.emit('commandSubmitted', command);
    }

    flush() {
        this.buffer = [];
    }
}
