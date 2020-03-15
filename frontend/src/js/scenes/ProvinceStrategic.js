import Phaser from 'phaser';

import Dialog from '../components/Dialog';
import InfoText from '../components/InfoText';
import LayerBuilder from '../components/LayerBuilder';
import ProvinceOverview from '../components/ProvinceOverview';

import uiStrategic from '../../images/ui/strategic.png';
import dialogBuild from '../../images/ui/dialog-build.png';
import dialogStructure from '../../images/ui/dialog-structure.png';
import logoAlien from '../../images/ui/logo-alien.png';
import logoHuman from '../../images/ui/logo-human.png';
import activeUnitSelection from '../../images/icons/active-unit-selection.png';
import roads from '../../images/roads/roads.png';

import terrain from './../../images/terrain';

import { registerUnits, registerStructures } from '../assets/Resources';
import { registerButtons, createButton, buttons } from '../assets/Buttons';

import customCursor from '../../images/misc/FALLEN_223.cur';
import customPointer from '../../images/misc/FALLEN_218.cur';
import structurePointer from '../../images/misc/FALLEN_218.cur';

import { Sounds } from './../assets/Sounds';
import { registerScenePath } from './../components/History';

import { UnitData, StructureData, ProvinceData } from 'shared';

const EventEmitter = require('eventemitter3');

export default class ProvinceStrategic extends Phaser.Scene {

    constructor() {
        super({
            key: 'ProvinceStrategic'
        });

        this.constructionMode = null;

        this.tileSize = {
            w: 70 / 2,
            h: 36
        };

        this.sounds = new Sounds();
        this.unitView = {};
        this.structureViews = {};
        this.infrastructureViews = {};
        this.cachedTileSelectors = {};
    }

    init(data) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view;

        const emitter = new EventEmitter();
        this.layerBuilder = new LayerBuilder(emitter);
        emitter.on('roadsUpdated', (roads) => {
            roads.forEach(road => {
                if (road.tileId) {
                    let existing = this.infrastructureViews[`${road.x}-${road.y}`];
                    if (existing) existing.destroy();
                    let { x, y } = this.screenCoordinates(road.x, road.y);
                    let obj = this.infrastructureBlitter.create(x, y, road.tileId);
                    this.infrastructureViews[`${road.x}-${road.y}`] = obj;
                } else {
                    this.infrastructureViews[`${road.x}-${road.y}`].destroy();
                    delete this.infrastructureViews[`${road.x}-${road.y}`];
                }
            });

            this.sound.play('road');
        });
        emitter.on('wallsUpdated', (walls) => {
            walls.forEach(wall => {
                if (wall.tileId) {
                    let existing = this.infrastructureViews[`${wall.x}-${wall.y}`];
                    if (existing) existing.destroy();
                    let { x, y } = this.screenCoordinates(wall.x, wall.y);
                    let obj = this.infrastructureBlitter.create(x, y, wall.tileId);
                    this.infrastructureViews[`${wall.x}-${wall.y}`] = obj;
                } else {
                    this.infrastructureViews[`${wall.x}-${wall.y}`].destroy();
                    delete this.infrastructureViews[`${wall.x}-${wall.y}`];
                }
            });
            this.sound.play('wbuild');
        });
        emitter.on('unitTurned', (unit) => {
            let view = this.unitView[unit.id];
            view.setFrame(unit.offset + unit.facing)
        });
        emitter.on('unitMoved', (unit) => {
            let view = this.unitView[unit.id];
            let { x, y } = this.screenCoordinates(unit.position.x, unit.position.y);
            view.setPosition(x, y);
            this.sound.play('telep');
            this.activeUnitSelection.setPosition(view.x, view.y);
            this.onConstructionModeUpdated();
        });
        emitter.on('structureBuilt', ({ models }) => {
            models.forEach((structure) => {
                let tileIndex = { x: structure.position.x, y: structure.position.y };
                let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);
                const structureImage = this.add.image(pos.x, pos.y, structure.spritesheet, structure.offset)
                    .setOrigin(0, 0)
                    .setInteractive({ cursor: 'url(' + structurePointer + '), pointer', pixelPerfect: true });
                this.mapContainer.add(structureImage);

                let views = this.structureViews[structure.id] || [];
                views.push(structureImage)
                this.structureViews[structure.id] = views;

                structureImage.on('pointerup', (_pointer, _x, _y, _event) => {
                    if (this.constructionMode) return;
                    this.onStructureSelected(structure, structureImage, tileIndex);
                });
            });
        });
        emitter.on('structureDemolished', ({ structureId }) => {
            this.structureViews[structureId].forEach(v => v.destroy());
            delete this.structureViews[structureId];
        });
        emitter.on('unitDemolished', ({ unitId }) => {
            this.unitView[unitId].destroy();
            delete this.unitView[unitId];
        });
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', (_event) => {
            this.onDeselected();
        });

        this.load.spritesheet('rocky', terrain.rocky.isometric, { frameWidth: 70, frameHeight: 54 });
        this.load.spritesheet('forest', terrain.forest.isometric, { frameWidth: 70, frameHeight: 54 });
        this.load.spritesheet('desert', terrain.desert.isometric, { frameWidth: 70, frameHeight: 54 });

        this.load.spritesheet('rocky-overview', terrain.rocky.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('forest-overview', terrain.forest.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('desert-overview', terrain.desert.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('overlay-overview', terrain.overlay, { frameWidth: 7, frameHeight: 7 });

        registerButtons(this, buttons.strategic);
        registerButtons(this, buttons.manufacturing);

        registerUnits(this);
        registerStructures(this);

        this.load.spritesheet('roads', roads, { frameWidth: 70, frameHeight: 54 });

        this.load.image('dialog-build', dialogBuild);
        this.load.image('dialog-structure', dialogStructure);

        this.load.image('ui-strategic', uiStrategic);
        this.load.image('active-unit-selection', activeUnitSelection);

        let game = this.cache.json.get(`game-${this.gameId}`);
        const logo = game.player.owner === 'HUMAN' ? logoHuman : logoAlien;
        this.load.image('logo', logo);

        this.sounds.preload(this);
    }

    onDeselected() {
        this.currentlySelectedUnit = null;
        this.constructionMode = null;
        this.onConstructionModeUpdated();
    }

    onStructureSelected(model, view, pos) {
    }

    onButtonsUpdated() {
        // based on the current state
        // show the appropriate button states

        this.input.setDefaultCursor(`url('${customCursor}'), pointer`);
        if (this.constructionMode) {
            switch (this.constructionMode.kind) {
                case 'road':
                    this.buttonBuild.setHighlight(false);
                    this.buttonRoad.setHighlight(true);
                    this.buttonRecycle.setHighlight(false);
                    break;
                case 'recycle':
                    this.buttonBuild.setHighlight(false);
                    this.buttonRoad.setHighlight(false);
                    this.buttonRecycle.setHighlight(true);
                    break;
                case 'pending-construction':
                    this.buttonBuild.setHighlight(true);
                    this.buttonRoad.setHighlight(false);
                    this.buttonRecycle.setHighlight(false);
                    break;
            }
        } else if (this.overviewProvince && this.overviewProvince.visible) {
            this.buttonMap.setHighlight(true);
            this.buttonRepair.disable();
            this.buttonBuild.disable();
            this.buttonRoad.disable();
            this.buttonRecycle.disable();
            this.input.setDefaultCursor(`auto`);
        } else {
            this.buttonRepair.enable();
            this.buttonBuild.enable();
            this.buttonRoad.enable();
            this.buttonRecycle.enable();
            this.buttonBuild.setHighlight(false);
            this.buttonRoad.setHighlight(false);
            this.buttonRecycle.setHighlight(false);
            this.buttonMap.setHighlight(false);
        }
    }

    onUnitSelected(model, pos) {
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

        this.sound.play('yessir');
        this.currentlySelectedUnit = model;
        let view = this.unitView[model.id];
        this.activeUnitSelection.setPosition(view.x, view.y);
        this.onConstructionModeUpdated();
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

        const hideBuildDialog = () => {
            if (!this.buildDialog) return;
            this.buildDialog.hide();
            this.buildDialog = null;
        }

        if (this.constructionMode && this.constructionMode.kind === 'pending-construction') {
            this.logo.visible = true;
            this.buildDialog = new Dialog(this, 16, 42, (structure) => {
                this.constructionMode = {
                    w: structure.display.width,
                    h: structure.display.height,
                    kind: 'structure',
                    category: structure.kind.category,
                    model: {
                        title: "Construction",
                        name: structure.kind.name,
                        cost: structure.usage.cash
                    }
                };
                this.onConstructionModeUpdated();
            }).show();
            this.uiContainer.add(this.buildDialog);
            this.infoText.visible = false;
            this.activeUnitSelection.visible = false;
            this.currentlySelectedUnit = null;
            this.updateCurrentConstructionGraphics(null);
        } else if (this.constructionMode) {
            this.logo.visible = false;
            this.infoText.setConstructionMode(this.constructionMode).setVisible(true);
            this.activeUnitSelection.visible = false;
            this.currentlySelectedUnit = null;
            hideBuildDialog();
        } else if (this.currentlySelectedUnit) {
            this.logo.visible = false;
            this.infoText.setUnitMode(this.currentlySelectedUnit).setVisible(true);
            hideBuildDialog();
            // this hides the selection when using overview map with a selected unit to 
            // easily move it to another location
            this.activeUnitSelection.visible = !this.overviewProvince.visible;
        } else {
            this.logo.visible = true;
            this.infoText.visible = false;
            this.activeUnitSelection.visible = false;
            this.currentlySelectedUnit = null;
            this.updateCurrentConstructionGraphics(null);
            hideBuildDialog();
        }
        this.onButtonsUpdated();
    }

    onOverviewToggled() {
        if (this.overviewProvince.visible) {
            this.overviewProvince.visible = false;
            this.overviewProvince.hide();
            this.mapContainer.visible = true;
        } else {
            this.constructionMode = null;
            this.overviewProvince.visible = true;
            this.overviewProvince.show(this.province, this.currentlySelectedUnit);
            this.mapContainer.visible = false;
        }

        this.onConstructionModeUpdated();
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

    pointerUpNearPointerDown(downStart) {
        const tolerance = 5;
        const movedX = Math.abs(Math.round(this.cameras.main.scrollX) - downStart.x) > tolerance;
        const movedY = Math.abs(Math.round(this.cameras.main.scrollY) - downStart.y) > tolerance;
        return !movedX && !movedY
    }

    renderTileLayers(container, layerBuilder) {
        container.add(this.terrainBlitter);
        container.add(this.infrastructureBlitter);

        let scanLines = (layerBuilder.height + layerBuilder.width) - 1;
        var line = 0;
        while (line < scanLines) {
            for (let i = 0, j = line; i <= line; i++, j--) {
                if (i >= layerBuilder.width) continue;
                if (j >= layerBuilder.height) continue;

                let tileIndex = { x: i, y: j };
                let pos = this.screenCoordinates(i, j);

                // render terrain
                this.terrainBlitter.create(pos.x, pos.y, layerBuilder.terrainAt(tileIndex));

                // render roads and walls
                if (layerBuilder.roadAt(tileIndex)) {
                    let obj = this.infrastructureBlitter.create(pos.x, pos.y, layerBuilder.roadAt(tileIndex));
                    this.infrastructureViews[`${i}-${j}`] = obj;
                }
                if (layerBuilder.wallAt(tileIndex)) {
                    let obj = this.infrastructureBlitter.create(pos.x, pos.y, layerBuilder.wallAt(tileIndex));
                    this.infrastructureViews[`${i}-${j}`] = obj;
                }

                // render structures
                let structure = layerBuilder.structureAt(tileIndex);
                if (structure) {
                    const structureImage = this.add.image(pos.x, pos.y, structure.spritesheet, structure.offset)
                        .setOrigin(0, 0)
                        .setInteractive({ cursor: 'url(' + structurePointer + '), pointer', pixelPerfect: true });
                    container.add(structureImage);

                    let views = this.structureViews[structure.id] || [];
                    views.push(structureImage)
                    this.structureViews[structure.id] = views;

                    structureImage.on('pointerup', (_pointer, _x, _y, event) => {
                        if (this.constructionMode) return;
                        this.onStructureSelected(structure, structureImage, tileIndex);
                    });
                }

                // render units
                let unit = layerBuilder.unitAt(tileIndex);
                if (unit) {
                    const unitImage = this.add.image(pos.x, pos.y, unit.spritesheet, unit.offset + unit.facing)
                        .setOrigin(0, 0)
                        .setInteractive({ cursor: 'url(' + customPointer + '), pointer', pixelPerfect: true });
                    container.add(unitImage);

                    this.unitView[unit.id] = unitImage;
                    unitImage.on('pointerup', (_pointer, _x, _y, event) => {
                        if (this.constructionMode) return;

                        event.stopPropagation();
                        this.onUnitSelected(unit, tileIndex);
                    });
                }
            }
            line++;
        }
    }

    centerCameraAtPoint(tileIndex) {
        let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);
        this.cameras.main.centerOn(pos.x, pos.y);
    }

    updateCurrentConstructionGraphics(tileIndex) {

        if (!this.constructionMode || !tileIndex) {
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
            case 'structure':
                return {
                    action: 'BUILD_STRUCTURE',
                    province: this.province,
                    targetId: null,
                    targetType: null,
                    position: tileIndex,
                    category: mode.category // structure.kind.category
                }
            case 'recycle':
                // units and structures sit above everything else
                // so first try and remove those
                let topMost = this.layerBuilder.unitAt(tileIndex) ||
                    this.layerBuilder.structureAt(tileIndex);

                // if we didn't get one of those, fall back to a road
                // or wall
                if (!topMost) {
                    // check for wall or road
                    if (this.layerBuilder.wallAt(tileIndex)) {
                        topMost = { id: tileIndex, type: 'wall' }
                    } else if (this.layerBuilder.roadAt(tileIndex)) {
                        topMost = { id: tileIndex, type: 'road' }
                    }
                }

                // still nothing? then we probably just selected
                // and empty square so just ignore it and don't 
                // generate a command
                if (!topMost) return null;

                return {
                    action: 'DEMOLISH',
                    province: this.province,
                    targetId: topMost.id,
                    targetType: topMost.type,
                    position: tileIndex
                }
        }
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId + '/' + this.province);

        let game = this.cache.json.get(`game-${this.gameId}`);

        let province = game.provinces[this.province];
        let reference = ProvinceData[this.province];

        this.layerBuilder.initialise(province, UnitData, StructureData, reference);

        this.mapContainer = this.add.container(0, 0).setInteractive({
            hitArea: new Phaser.Geom.Polygon([
                35, 18,
                36, 18,
                35 + (35 * reference.width), 18 + (18 * reference.width),
                35 + (35 * reference.width) - (35 * reference.height), 19 + (18 * reference.width) + (18 * reference.height),
                35 - (35 * reference.height), 19 + (18 * reference.height),
                35 - (35 * reference.height), 18 + (18 * reference.height)
            ]),
            hitAreaCallback: Phaser.Geom.Polygon.Contains,
            useHandCursor: true,
            draggable: true
        });

        this.add.existing(this.mapContainer);

        this.terrainBlitter = this.add.blitter(0, 0, reference.type);
        this.infrastructureBlitter = this.add.blitter(0, 0, 'roads');
        this.renderTileLayers(this.mapContainer, this.layerBuilder);

        // Render active unit selection
        this.activeUnitSelection = this.add.image(0, 0, 'active-unit-selection')
            .setOrigin(0.2, 0)
            .setVisible(false)
            .setDepth(2);

        this.uiCamera = this.cameras.add(0, 0, 640, 480)
            .setOrigin(0, 0);

        let dragStart = { x: 0, y: 0 };
        this.input.on('dragstart', () => {
            dragStart = { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY };
        });

        this.input.on('drag', function (_pointer, _gameObject, dragX, dragY) {
            this.cameras.main.scrollX = dragStart.x - (dragX / this.cameras.main.zoom);
            this.cameras.main.scrollY = dragStart.y - (dragY / this.cameras.main.zoom);
        }.bind(this));

        let downStart = { x: 0, y: 0 };
        this.input.on('pointerdown', (_pointer) => {
            if (this.buildDialog) return;
            downStart = { x: Math.round(this.cameras.main.scrollX), y: Math.round(this.cameras.main.scrollY) };
        }, this);

        this.input.on('pointermove', (pointer, _localX, _localY, _event) => {
            let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);
            this.updateCurrentConstructionGraphics(tileIndex);
        }, this);

        this.input.on('pointerup', (pointer) => {
            if (!this.pointerUpNearPointerDown(downStart)) return;

            let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);

            if (this.constructionMode) {
                let command = this.constructionCommand(this.constructionMode, tileIndex);
                if (command) {
                    this.layerBuilder.processCommand(command);
                }
            } else if (this.overviewProvince.visible) {
                // find the selected tile
                tileIndex = {
                    x: Math.floor((pointer.x - this.overviewProvince.x) / 7),
                    y: Math.floor((pointer.y - this.overviewProvince.y) / 7),
                }
                // center it on the screen
                this.centerCameraAtPoint(tileIndex);
                // and hide the overview
                this.onOverviewToggled();
            } else if (this.currentlySelectedUnit) {
                // if we already have a selected unit
                if (this.layerBuilder.unitCanOccupy(this.currentlySelectedUnit, tileIndex, reference.type)) {
                    this.onUnitMoved(this.currentlySelectedUnit, tileIndex);
                }
            }
        }, this);

        // Static UI in a container
        let ui = this.add.container(0, 0).setDepth(2);

        this.overviewProvince = new ProvinceOverview(this, 32, 34, game, ui).setVisible(false);
        ui.add(this.overviewProvince);
        this.buttonRepair = createButton(this, 12, 410, buttons.strategic.repair, (button) => {
            // TODO: submit a repair command
            alert('No buildings or dropships damaged');
        })
        ui.add(this.buttonRepair);
        this.buttonBuild = createButton(this, 52, 410, buttons.strategic.build, (button) => {
            if (this.constructionMode && this.constructionMode.kind === 'pending-construction') {
                this.constructionMode = null;
            } else {
                this.constructionMode = { w: 1, h: 1, kind: 'pending-construction' };
            }
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonBuild);
        this.buttonRoad = createButton(this, 113, 410, buttons.strategic.road, (button) => {
            if (this.constructionMode && this.constructionMode.kind === 'road') {
                this.constructionMode = null;
            } else {
                this.constructionMode = { w: 1, h: 1, kind: 'road' };
            }
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonRoad);
        this.buttonRecycle = createButton(this, 161, 410, buttons.strategic.recycle, (button) => {
            if (this.constructionMode && this.constructionMode.kind === 'recycle') {
                this.constructionMode = null;
            } else {
                this.constructionMode = { w: 1, h: 1, kind: 'recycle' };
            }
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonRecycle);
        this.buttonMap = createButton(this, 424, 410, buttons.strategic.map, (button) => { this.onOverviewToggled() });
        ui.add(this.buttonMap);
        this.buttonMenu = createButton(this, 486, 410, buttons.strategic.menu, (button) => {
            this.scene.start('MainMenu');
        });
        ui.add(this.buttonMenu);
        this.buttonColony = createButton(this, 563, 410, buttons.strategic.colony, (button) => {
            this.scene.start('LoadGameResources', {
                gameId: this.gameId
            });
        })
        ui.add(this.buttonColony);

        ui.add(this.add.image(0, 0, 'ui-strategic').setOrigin(0, 0));

        this.logo = this.add.image(232, 413, 'logo').setOrigin(0, 0).setVisible(true);
        ui.add(this.logo);

        this.infoText = new InfoText(this, 232, 413).setVisible(false);
        ui.add(this.infoText);

        let infoTextZone = this.add.zone(232, 413, 183, 64)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', (_pointer, _x, _y, event) => {
                event.stopPropagation();
                this.onDeselected();
            });
        ui.add(infoTextZone);
        this.uiContainer = ui;
        this.add.existing(ui);

        this.cameras.main.ignore(ui);
        this.uiCamera.ignore(this.mapContainer);

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            speed: 0.7
        });

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        ui.add(this.add.text(58, 6, province.research, font).setOrigin(0.5, 0));
        ui.add(this.add.text(133, 6, province.energy, font).setOrigin(0.5, 0));
        ui.add(this.add.text(320, 6, reference.name, font).setOrigin(0.5, 0));
        ui.add(this.add.text(569, 6, game.player.globalReserve + "/" + province.credits, font).setOrigin(0.5, 0));

        this.centerCameraAtPoint({ x: reference.width / 2, y: reference.height / 2 });
    }

    update(time, delta) {
        this.controls.update(delta);
    }

}
