import { Scene } from 'phaser';

import { data, api } from '../Config';

export default class LoadGameResources extends Scene {
    constructor() {
        super({
            key: 'LoadGameResources'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.colony = data.colony;
        this.view = data.view;
    }

    preload() {
        this.load.json('data-provinces', data("/provinces.json"));
        this.load.json('data-structures', data("/structures.json"));
        this.load.json('data-units', data("/units.json"));

        // dynamic content
        this.load.json('current-game', api("/games/" + this.gameId));
    }

    create() {
        const data = { gameId: this.gameId, colony: this.colony, view: this.view };

        if (!this.colony) {
            // must be an overview
            this.game.scene.start('StrategicView', data);
        } else if (this.colony) {
            // otherwise it's most likely the Play view
            this.game.scene.start('Play', data);
        } else {
            console.error('Unable to navigate to correct game scene');
        }
    }
}
