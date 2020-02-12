import Phaser from 'phaser';

import Dialog from '../components/Dialog';
import LayerBuilder from '../components/LayerBuilder';

// TODO: come up with a better way of referencing these images
import rocky from '../../images/terrain/rocky.png';
import desert from '../../images/terrain/desert.png';
import forest from '../../images/terrain/forest.png';
import uiStrategic from '../../images/ui/strategic.png';
import activeUnitSelection from '../../images/icons/active-unit-selection.png';
import logoAlien from '../../images/ui/logo-alien.png';
import logoHuman from '../../images/ui/logo-human.png';
import roads from '../../images/roads/roads.png';

import { registerUnits, registerStructures } from '../assets/Resources';
import { registerButtons, createButton, buttons } from '../assets/Buttons';

import customCursor from '../../images/misc/FALLEN_223.cur';
import customPointer from '../../images/misc/FALLEN_218.cur';
import structurePointer from '../../images/misc/FALLEN_218.cur';

import { Sounds } from './../assets/Sounds';
import { registerScenePath } from './../components/History';

const EventEmitter = require('eventemitter3');

export default class Play extends Phaser.Scene {

    constructor() {
        super({
            key: 'Play'
        });

        this.isDragging = false;
        this.touchStart = null;
        this.constructionMode = null;

        this.tileSize = {
            w: 70 / 2,
            h: 36
        };

        this.sounds = new Sounds();
        this.unitViews = {};
        this.cachedTileSelectors = {};
    }

    init(data) {
        this.gameId = data.gameId;
        this.province = data.province;

        const emitter = new EventEmitter();
        this.layerBuilder = new LayerBuilder(emitter);
        emitter.on('roadsUpdated', (roads) => {
            roads.forEach(road => {
                let { x, y } = this.screenCoordinates(road.x, road.y);
                this.roadBlitter.create(x, y, road.tileId);
            });
            this.sound.play('road');
        });
        emitter.on('wallsUpdated', (walls) => {
            walls.forEach(wall => {
                let { x, y } = this.screenCoordinates(wall.x, wall.y);
                this.roadBlitter.create(x, y, wall.tileId);
            });
            this.sound.play('wbuild');
        });
        emitter.on('unitTurned', (unit) => {
            let view = this.unitViews[unit.id];
            view.setFrame(unit.offset + unit.facing)
        });
        emitter.on('unitMoved', (unit) => {
            let view = this.unitViews[unit.id];
            let { x, y } = this.screenCoordinates(unit.position.x, unit.position.y);
            view.setPosition(x, y);
            this.sound.play('telep');
            this.activeUnitSelection.setPosition(view.x, view.y);
            this.activeUnitSelection.visible = false;
            this.currentlySelectedUnit = null;
        });
    }

    preload() {
        this.cameras.main.setSize(640, 480);
        this.cursors = this.input.keyboard.createCursorKeys();

        // TODO: register terrain
        this.load.spritesheet('rocky', rocky, { frameWidth: 70, frameHeight: 54 });
        this.load.spritesheet('forest', forest, { frameWidth: 70, frameHeight: 54 });
        this.load.spritesheet('desert', desert, { frameWidth: 70, frameHeight: 54 });

        registerButtons(this, buttons.strategic);

        registerUnits(this);
        registerStructures(this);

        this.load.spritesheet('roads', roads, { frameWidth: 70, frameHeight: 54 });

        this.load.image('ui-strategic', uiStrategic);
        this.load.image('active-unit-selection', activeUnitSelection);

        let game = this.cache.json.get(`game-${this.gameId}`);
        const logo = game.player.owner === 'HUMAN' ? logoHuman : logoAlien;
        this.load.image('logo', logo);

        this.sounds.preload(this);
    }

    onStructureSelected(model, view, pos) {
        console.log(`onStructureSelected('${JSON.stringify(model, null, 2)}', '${JSON.stringify(view, null, 2)}', '${JSON.stringify(pos, null, 2)}')`)
    }

    onUnitSelected(model, pos) {
        this.sound.play('yessir');
        if (this.currentlySelectedUnit && this.currentlySelectedUnit === model) {
            this.layerBuilder.processCommand({
                action: 'TURN',
                province: this.province,
                targetId: model.id,
                targetType: 'unit',
                position: pos,
                facing: model.facing
            });
            return;
        }

        this.currentlySelectedUnit = model;
        this.activeUnitSelection.visible = true;
        let view = this.unitViews[model.id];
        this.activeUnitSelection.setPosition(view.x, view.y);
    }

    onUnitMoved(model, pos) {
        this.layerBuilder.processCommand(
            {
                action: 'MOVE',
                province: this.province,
                targetId: model.id,
                targetType: 'unit',
                position: pos,
                facing: model.facing
            }
        );
    }

    onConstructionModeUpdated() {
        if (this.constructionMode) {
            this.logo.visible = false;
        } else {
            this.logo.visible = true;
        }
    }

    // Converts pointer coordinates to tile x, y
    tileIndexFromCoordinates(x, y) {
        let h = this.tileSize.h;
        let w = this.tileSize.w * 2;
        x = x - (w / 2.0);
        y = y - (h / 2.0);
        return {
            x: Math.floor((x / (w / 2.0) + y / (h / 2.0)) / 2.0),
            y: Math.floor((y / (h / 2.0) - (x / (w / 2.0))) / 2.0)
        };
    }

    screenCoordinates(x, y) {
        let screenIndex = {
            x: x - y,
            y: (x + y) / 2
        };
        return {
            x: screenIndex.x * this.tileSize.w,
            y: screenIndex.y * this.tileSize.h
        }
    }

    // TODO: all this needs to move to real modules
    loadTileSelector(enabled, size) {
        let { x, y } = size;
        let key = `${x}-${y}-${enabled}`;

        if (this.cachedTileSelectors[key]) {
            return this.cachedTileSelectors[key];
        }

        let graphics = this.add.graphics((35 + (35 * x)) - (35 - (35 * y)), 19 + (18 * x) + (18 * y));
        graphics.lineStyle(1, 0xFFFFFF, 1.0);
        graphics.beginPath();
        // top middle
        graphics.moveTo(35, 18);
        graphics.lineTo(36, 18);
        // right based on width
        graphics.lineTo(35 + (35 * x), 18 + (18 * x));
        // bottom based on height
        graphics.lineTo(35 + (35 * x) - (35 * y), 19 + (18 * x) + (18 * y));
        // left based on height
        graphics.lineTo(35 - (35 * y), 19 + (18 * y));
        graphics.lineTo(35 - (35 * y), 18 + (18 * y));
        graphics.closePath();
        graphics.strokePath();

        // enabled == whether to draw a cross through it or not for construction
        if (!enabled) {
            graphics.beginPath();
            graphics.moveTo(35, 18);
            graphics.lineTo(35 + (35 * x) - (35 * y), 19 + (18 * x) + (18 * y));
            graphics.moveTo(35 - (35 * y), 19 + (18 * y));
            graphics.lineTo(35 + (35 * x), 18 + (18 * x));
            graphics.strokePath();
        }

        graphics.setDepth(1);
        this.cachedTileSelectors[key] = graphics;
        return graphics;
    }

    pointerUpNearPointerDown() {
        const tolerance = 5;
        const movedX = Math.abs(Math.round(this.cameras.main.scrollX) - (this.touchStartCamera ? this.touchStartCamera.x : 0)) > tolerance;
        const movedY = Math.abs(Math.round(this.cameras.main.scrollY) - (this.touchStartCamera ? this.touchStartCamera.y : 0)) > tolerance;
        return !movedX && !movedY
    }

    renderTileLayers(layerBuilder) {
        let scanLines = (layerBuilder.height + layerBuilder.width) - 1;
        var line = 0;
        while (line < scanLines) {
            for (let i = 0, j = line; i <= line; i++ , j--) {
                if (i >= layerBuilder.width) continue;
                if (j >= layerBuilder.height) continue;

                let tileIndex = { x: i, y: j };
                let pos = this.screenCoordinates(i, j);

                // render terrain
                this.terrainBlitter.create(pos.x, pos.y, layerBuilder.terrainAt(tileIndex));

                // render roads and walls
                if (layerBuilder.roadAt(tileIndex)) {
                    this.roadBlitter.create(pos.x, pos.y, layerBuilder.roadAt(tileIndex));
                }
                if (layerBuilder.wallAt(tileIndex)) {
                    this.roadBlitter.create(pos.x, pos.y, layerBuilder.wallAt(tileIndex));
                }

                // render structures
                let structure = layerBuilder.structureAt(tileIndex);
                if (structure) {
                    const structureImage = this.add.image(pos.x, pos.y, structure.spritesheet, structure.offset)
                        .setOrigin(0, 0)
                        .setInteractive({ cursor: 'url(' + structurePointer + '), pointer' });

                    structureImage.on('pointerdown', (_pointer, _x, _y, event) => {
                        if (this.constructionMode) return;

                        event.stopPropagation();
                        this.onStructureSelected(structure, structureImage, tileIndex);
                    });
                }

                // render units
                let unit = layerBuilder.unitAt(tileIndex);
                if (unit) {
                    const unitImage = this.add.image(pos.x, pos.y, unit.spritesheet, unit.offset + unit.facing)
                        .setOrigin(0, 0)
                        .setInteractive({ cursor: 'url(' + customPointer + '), pointer' });

                    this.unitViews[unit.id] = unitImage;
                    unitImage.on('pointerdown', (_pointer, _x, _y, event) => {
                        if (this.constructionMode) return;

                        event.stopPropagation();
                        this.onUnitSelected(unit, tileIndex);
                    });
                }
            }
            line++;
        }
    }

    updateCurrentConstructionGraphics(tileIndex) {

        if (!this.constructionMode) {
            // hide all tile selectors
            Object.values(this.cachedTileSelectors).forEach(graphics => { graphics.visible = false });
            return;
        }

        let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);

        let size = { x: this.constructionMode.w, y: this.constructionMode.h };
        let validForConstruction = this.layerBuilder.validForConstruction(tileIndex, size);

        let graphics = this.loadTileSelector(validForConstruction, size);
        graphics.setPosition(pos.x, pos.y);

        // Only show the current tile selector graphic
        Object.values(this.cachedTileSelectors).forEach(g => { g.visible = (graphics === g) });

        // TODO: Update the text down the bottom based on this.constructionMode.kind
        // Construction
        // Road
        // Cost 5 Credits
    }

    constructionCommand(mode, tileIndex) {
        switch (mode.kind) {
            case 'road':
                return {
                    action: 'ROAD',
                    province: this.province,
                    targetId: null,
                    targetType: null,
                    position: tileIndex
                }
        }
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId + '/' + this.province);

        let game = this.cache.json.get(`game-${this.gameId}`);

        const data = {
            terrain: this.cache.json.get('data-provinces'),
            structures: this.cache.json.get('data-structures'),
            units: this.cache.json.get('data-units')
        }

        let province = game.provinces[this.province];
        let terrain = data.terrain[this.province];

        this.terrainBlitter = this.add.blitter(0, 0, terrain.type);
        this.roadBlitter = this.add.blitter(0, 0, 'roads');

        this.layerBuilder.initialise(province, data, terrain);
        this.renderTileLayers(this.layerBuilder);

        // Render active unit selection
        this.activeUnitSelection = this.add.image(0, 0, 'active-unit-selection').setOrigin(0.2, 0).setDepth(1);
        this.activeUnitSelection.visible = false;

        this.input.on('pointerdown', (pointer) => {
            if (this.topDialog) return;
            this.isDragging = true;
            this.touchStart = { x: pointer.x, y: pointer.y };
            this.touchStartCamera = { x: Math.round(this.cameras.main.scrollX), y: Math.round(this.cameras.main.scrollY) };
        }, this);
        this.input.on('pointerup', (pointer) => {
            if (this.pointerUpNearPointerDown()) {
                let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);

                if (this.constructionMode) {
                    let command = this.constructionCommand(this.constructionMode, tileIndex);
                    if (command) {
                        this.layerBuilder.processCommand(command);
                    }
                } else if (this.currentlySelectedUnit) {
                    // if we already have a selected unit
                    if (this.layerBuilder.unitCanOccupy(tileIndex)) {
                        this.onUnitMoved(this.currentlySelectedUnit, tileIndex);
                    }
                }
            }

            this.isDragging = false;
            this.touchStart = null;
            this.touchStartCamera = null;
        }, this);
        this.input.on('pointermove', (pointer, _localX, _localY, event) => {
            let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);
            this.updateCurrentConstructionGraphics(tileIndex);

            // move the map
            if (!this.isDragging) return;

            this.cameras.main.scrollX += (this.touchStart.x - pointer.x);
            this.cameras.main.scrollY += (this.touchStart.y - pointer.y);
            this.touchStart = { x: pointer.x, y: pointer.y };
        }, this);
        this.input.on('pointerout', (pointer) => {
            this.isDragging = false;
        }, this);
        this.input.setDefaultCursor('url(' + customCursor + '), pointer');

        // Static UI in a container
        let ui = this.add.container(0, 0).setScrollFactor(0).setDepth(2);

        ui.add(createButton(this, 12, 410, buttons.strategic.repair, (button) => {
            alert('No buildings or dropships damaged');
        }));
        ui.add(createButton(this, 52, 410, buttons.strategic.build, (button) => {
            if (this.topDialog) {
                this.topDialog.dismiss();
                this.topDialog = null;
                button.setHighlight(false);
                // TODO: if this is a different key, show that instead
            } else if (this.scene.isSleeping('build')) {
                // TODO: tidy these up - messy
                this.scene.wake('build');
                this.topDialog = this.scene.get('build');
                button.setHighlight(true);
            } else {
                let window = new Dialog('build', 16, 42, this);
                this.scene.add(window.key, window, true);
                this.topDialog = window;
                button.setHighlight(true);
            }
        }));
        ui.add(createButton(this, 113, 410, buttons.strategic.road, (button) => {
            if (this.constructionMode) {
                this.constructionMode = null;
                button.setHighlight(false);
            } else {
                this.constructionMode = { w: 1, h: 1, kind: 'road' };
                this.activeUnitSelection.visible = false;
                button.setHighlight(true);
            }
            this.onConstructionModeUpdated();
        }));
        ui.add(createButton(this, 161, 410, buttons.strategic.recycle, (button) => { }));
        ui.add(createButton(this, 424, 410, buttons.strategic.map, (button) => { }));
        ui.add(createButton(this, 486, 410, buttons.strategic.menu, (button) => { }));
        ui.add(createButton(this, 563, 410, buttons.strategic.colony, (button) => {
            this.scene.start('StrategicView', { gameId: this.gameId });
        }));

        ui.add(this.add.image(0, 0, 'ui-strategic').setOrigin(0, 0));

        this.logo = this.add.image(232, 413, 'logo').setOrigin(0, 0);
        ui.add(this.logo);

        var cursors = this.input.keyboard.createCursorKeys();

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.7
        });

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        ui.add(this.add.text(48, 7, province.research, font));
        ui.add(this.add.text(125, 7, province.energy, font));
        ui.add(this.add.text(300, 7, terrain.name, font));
        ui.add(this.add.text(540, 7, game.player.globalReserve + "/" + province.credits, font));
    }

    update(time, delta) {
        this.controls.update(delta);
    }

    render() {
    }
}
