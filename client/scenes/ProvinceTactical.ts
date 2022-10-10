import { PlayerGameProjection } from '../../shared/index';
import Phaser from 'phaser';
import { ProvinceKey } from '../../shared/index';
import { registerScenePath } from './History';
import { InGameView } from './StrategicOverview';

export default class ProvinceTactical extends Phaser.Scene {
    gameId!: string;
    view: string | undefined;
    province!: ProvinceKey;

    constructor() {
        super({
            key: 'ProvinceTactical'
        });
    }

    init(data: { gameId: string, view?: InGameView, province: ProvinceKey }) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view;
    }

    preload() {
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId + '/' + this.province);

        const game = this.cache.json.get(`game-${this.gameId}`) as PlayerGameProjection;

        console.log('loading game ' + game);
    }
}
