import { GameObjects } from "phaser";
import LayerBuilder from "./LayerBuilder";

export default class ProvinceOverview extends GameObjects.Container {

    constructor(scene, x, y, game) {
        super(scene, x, y);

        this.game = game;
    }

    show(provinceId) {
        let reference = this.scene.cache.json.get('data-provinces')[provinceId];

        let builder = new LayerBuilder(null);

        const data = {
            terrain: this.scene.cache.json.get('data-provinces'),
            structures: this.scene.cache.json.get('data-structures'),
            units: this.scene.cache.json.get('data-units')
        }

        let province = this.game.provinces[provinceId];
        let terrain = data.terrain[provinceId];

        builder.initialise(province, data, terrain);

        // This requires the owning scene to have preloaded the appropriate -overview resources
        this.terrainBlitter = this.scene.add.blitter(this.x, this.y, reference.type + '-overview');
        this.overlayBlitter = this.scene.add.blitter(this.x, this.y, 'overlay-overview');

        for (let i = 0; i < terrain.height; i++) {
            for (let j = 0; j < terrain.width; j++) {
                let tileIndex = { x: i, y: j };
                this.terrainBlitter.create(i * 7, j * 7, builder.terrainAt(tileIndex));
                if (builder.roadAt(tileIndex)) {
                    this.overlayBlitter.create(i * 7, j * 7, builder.roadOverviewAt(tileIndex));
                }
                if (builder.wallAt(tileIndex)) {
                    this.overlayBlitter.create(i * 7, j * 7, builder.wallOverviewAt(tileIndex));
                }
                if (builder.structureAt(tileIndex)) {
                    this.overlayBlitter.create(i * 7, j * 7, builder.structureOverviewAt(tileIndex));
                }
                if (builder.unitAt(tileIndex)) {
                    this.overlayBlitter.create(i * 7, j * 7, builder.unitOverviewAt(tileIndex));
                }
            }
        }
    }

    hide() {
        if (this.terrainBlitter) this.terrainBlitter.setVisible(false);
        if (this.overlayBlitter) this.overlayBlitter.setVisible(false);
    }
}

