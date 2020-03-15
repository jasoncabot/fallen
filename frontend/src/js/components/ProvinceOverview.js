import { GameObjects } from "phaser";
import LayerBuilder from "./LayerBuilder";
import { UnitData, StructureData, ProvinceData } from 'shared';

export default class ProvinceOverview extends GameObjects.Container {

    constructor(scene, x, y, game, container) {
        super(scene, x, y);

        this.container = container;
        this.game = game;
    }

    show(provinceId, selectedUnit) {
        let builder = new LayerBuilder(null);

        let reference = ProvinceData[provinceId];

        let province = this.game.provinces[provinceId];

        builder.initialise(province, UnitData, StructureData, reference);

        // This requires the owning scene to have preloaded the appropriate -overview resources
        this.terrainBlitter = this.scene.add.blitter(this.x, this.y, reference.type + '-overview');
        this.overlayBlitter = this.scene.add.blitter(this.x, this.y, 'overlay-overview');

        if (this.container) {
            this.container.add(this.terrainBlitter);
            this.container.add(this.overlayBlitter);
        }

        for (let i = 0; i < reference.height; i++) {
            for (let j = 0; j < reference.width; j++) {
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
                    let unit = this.overlayBlitter.create(i * 7, j * 7, builder.unitOverviewAt(tileIndex));
                    if (selectedUnit && selectedUnit.position.x === tileIndex.x && selectedUnit.position.y === tileIndex.y) {
                        this.scene.add.tween({
                            targets: [unit],
                            ease: 'Cubic.Out',
                            duration: 500,
                            delay: 0,
                            alpha: {
                                getStart: () => 0,
                                getEnd: () => 1.0
                            },
                            loop: -1,
                            yoyo: true
                        });
                    }
                }
            }
        }
    }

    hide() {
        if (this.terrainBlitter) this.terrainBlitter.setVisible(false);
        if (this.overlayBlitter) this.overlayBlitter.setVisible(false);
    }
}

