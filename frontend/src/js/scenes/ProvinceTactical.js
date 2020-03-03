import Phaser from 'phaser';

import { UnitData, StructureData, ProvinceData } from 'shared';

export default class ProvinceTactical extends Phaser.Scene {

    constructor() {
        super({
            key: 'ProvinceTactical'
        });

    }

    init(data) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view;
    }

    preload() {
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId + '/' + this.province);

        let game = this.cache.json.get(`game-${this.gameId}`);

        let province = game.provinces[this.province];
        let reference = ProvinceData[this.province];

    }
}
