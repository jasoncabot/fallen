import { Scene } from 'phaser';

import { registerScenePath } from './../components/History';

export default class Encyclopedia extends Scene {

    constructor() {
        super({ key: 'Encyclopedia' });
    }

    preload() {
    }

    create() {
        registerScenePath(this, '/encyclopedia');
    }

}
