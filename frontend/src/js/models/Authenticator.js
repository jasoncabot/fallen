const uuidv4 = require('uuid/v4');

export class Authenticator {
    constructor() {
        this.id = localStorage.getItem('playerId');
        this.name = localStorage.getItem('name') ?? "";
        if (!this.id) {
            this.id = uuidv4();
            localStorage.setItem('playerId', this.id);
        }
    }

}
