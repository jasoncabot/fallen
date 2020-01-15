import { Scene } from 'phaser';

import { data } from '../Config';

export default class LoadGameResources extends Scene {
    constructor() {
        super({
            key: 'LoadGameResources'
        });
    }

    init(data) {
        this.options = data;
    }

    preload() {
        this.load.json('data-provinces', data("/provinces.json"));
        this.load.json('data-structures', data("/structures.json"));
        this.load.json('data-units', data("/units.json"));
    }

    create() {
        this.scene.start('Play', { gameId: 1 });
    }
}
