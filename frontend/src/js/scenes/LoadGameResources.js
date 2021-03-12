import { Scene } from 'phaser';

import * as api from '../models/API';

export default class LoadGameResources extends Scene {
    constructor() {
        super({
            key: 'LoadGameResources'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view;

        this.game.socket.emit("game:join", data.gameId);
    }

    preload() {
        // dynamic content
        api.getAndCache(`/games/${this.gameId}`, this, `game-${this.gameId}`);
    }

    create() {
        const data = { gameId: this.gameId, province: this.province, view: this.view };

        // if we don't have a specific province to view
        if (!this.province) {
            // must be an overview
            this.scene.start('StrategicOverview', data);
        } else if (this.province) {
            // otherwise it's most likely the strategic view
            this.scene.start('ProvinceStrategic', data);
        } else {
            console.error('Unable to navigate to correct game scene');
        }
    }
}
