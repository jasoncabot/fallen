import Phaser from 'phaser';
import { GameObjects } from "phaser";

import { PlayerGameProjection, provinceForKey, StructureData, UnitData, ProvinceKey, UnitValue } from '../../shared/index';

import StrategicProjectionAdapter from '../features/strategic/adapters/StrategicProjectionAdapter';

const TERRAIN_OVERVIEW_TEXTURE_KEYS = ['desert-overview', 'forest-overview', 'rocky-overview'] as const;

export default class ProvinceOverview extends GameObjects.Container {
    container: GameObjects.Container | null;
    game: PlayerGameProjection;
    terrainBlitter?: GameObjects.Blitter;
    overlayBlitter?: GameObjects.Blitter;

    constructor(scene: Phaser.Scene, x: number, y: number, game: PlayerGameProjection, container: Phaser.GameObjects.Container | null) {
        super(scene, x, y);

        this.container = container;
        this.game = game;
    }

    show(provinceId: ProvinceKey, selectedUnit: { position: { x: number; y: number } } | null) {
        let builder = new StrategicProjectionAdapter();

        let reference = provinceForKey(provinceId);
        if (!reference) {
            console.warn(`⚠️ ProvinceOverview: Missing province lookup for '${String(provinceId)}'`);
            return;
        }

        let province = this.game.provinces[provinceId];

        builder.initialise(province, UnitData, StructureData, reference);

        // This requires the owning scene to have preloaded the appropriate -overview resources
        this.terrainBlitter = this.scene.add.blitter(this.x, this.y, TERRAIN_OVERVIEW_TEXTURE_KEYS[reference.type()]);
        this.overlayBlitter = this.scene.add.blitter(this.x, this.y, 'overlay-overview');

        if (this.container) {
            this.container.add(this.terrainBlitter);
            this.container.add(this.overlayBlitter);
        }

        for (let i = 0; i < reference.height(); i++) {
            for (let j = 0; j < reference.width(); j++) {
                let tileIndex = { x: i, y: j };
                this.terrainBlitter.create(i * 7, j * 7, builder.terrainTileAt(tileIndex));
                if (builder.roadAt(tileIndex)) {
                    this.overlayBlitter.create(i * 7, j * 7, builder.roadOverviewAt(tileIndex));
                }
                if (builder.wallAt(tileIndex)) {
                    this.overlayBlitter.create(i * 7, j * 7, builder.wallOverviewAt(tileIndex));
                }
                if (builder.structureAt(tileIndex)) {
                    const structureTile = builder.structureOverviewAt(tileIndex);
                    if (structureTile !== null && structureTile !== undefined) {
                        this.overlayBlitter.create(i * 7, j * 7, structureTile);
                    }
                }
                if (builder.unitAt(tileIndex)) {
                    const unitTile = builder.unitOverviewAt(tileIndex);
                    if (unitTile === null) continue;
                    let unit = this.overlayBlitter.create(i * 7, j * 7, unitTile);
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
