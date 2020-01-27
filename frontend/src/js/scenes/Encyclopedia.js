import { Scene } from 'phaser';

export default class Encyclopedia extends Scene {

    constructor() {
        super({ key: 'Encyclopedia' });
    }

    preload() {
    }

    create() {
        history.pushState({}, 'Fallen Haven', '/encyclopedia');
    }

}
