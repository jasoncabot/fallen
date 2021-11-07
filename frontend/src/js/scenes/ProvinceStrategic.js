import Phaser from 'phaser';

import {
    ConstructionDialog,
    InfoText,
    MessageBox,
    ProvinceOverview,
    registerScenePath,
    StructureDialog,
} from '../components/';

import { LayerBuilder } from '../components/ProvincePresenter';

import { Strategic, LogoAlien, LogoHuman } from '../../images/ui';
import activeUnitSelection from '../../images/icons/active-unit-selection.png';

import { preloadTerrainForProvince } from '../../images/terrain';
import { buildMapDataForProvince } from '../../maps';
import { preloadStructures } from '../../images/structures';
import { preloadUnits } from '../../images/units';

import { registerButtons, createButton, buttons } from '../assets/Buttons';

import customCursor from '../../images/misc/FALLEN_223.cur';
import customPointer from '../../images/misc/FALLEN_218.cur';
import structurePointer from '../../images/misc/FALLEN_218.cur';

import { preloadSounds } from './../assets/Sounds';

import { ProvinceData, ProvinceIndexer, ResourceCalculator } from 'shared';

export default class ProvinceStrategic extends Phaser.Scene {

    constructor() {
        super({
            key: 'ProvinceStrategic'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view;

        this.commandQueue = this.game.commandQueue;
        const layerBuilder = new LayerBuilder(this.commandQueue.emitter);
        layerBuilder.roadsUpdated = (roads) => {
            roads.forEach(road => {
                if (road.tileId) {
                    let existing = this.infrastructureViews[`${road.x}-${road.y}`];
                    if (existing) existing.destroy();
                    let { x, y } = { x: 0, y: 0 }; // TODO: this.screenCoordinates(road.x, road.y);
                    let obj = this.infrastructureBlitter.create(x, y, road.tileId);
                    this.infrastructureViews[`${road.x}-${road.y}`] = obj;
                } else {
                    this.infrastructureViews[`${road.x}-${road.y}`].destroy();
                    delete this.infrastructureViews[`${road.x}-${road.y}`];
                }
            });
            this.sound.play('road');
        };
        layerBuilder.structureBuilt = (models) => {
            models.forEach((structure) => {
                let pos = this.screenCoordinates(structure.position.x, structure.position.y);
                this.renderStructure(structure, pos);
            });
        };
        layerBuilder.structureDemolished = (structureId) => {
            this.structureViews[structureId].forEach(v => v.destroy());
            delete this.structureViews[structureId];
        };
        layerBuilder.structuresRepaired = () => {
            // TODO: remove any damaged animations
        }
        layerBuilder.unitBoarded = (unitId) => {
            let view = this.unitView[unitId];
            view.destroy();
            delete this.unitView[unitId];
            this.sound.play('inout');
            this.currentlySelectedUnit = null;
            this.onConstructionModeUpdated();
        };
        layerBuilder.unitDemolished = (unitId) => {
            this.unitView[unitId].destroy();
            delete this.unitView[unitId];
        };
        layerBuilder.unitMoved = (unit) => {
            let view = this.unitView[unit.id];
            let { x, y } = this.screenCoordinates(unit.position.x, unit.position.y);
            view.setPosition(x, y);
            this.sound.play('telep');
            this.activeUnitSelection.setPosition(view.x, view.y);
            this.onConstructionModeUpdated();
        };
        layerBuilder.unitDisembarked = (unit) => {
            const view = this.renderUnit(unit, unit.position);
            let { x, y } = this.screenCoordinates(unit.position.x, unit.position.y);
            view.setPosition(x, y);
            this.sound.play('inout');
            this.activeUnitSelection.setPosition(view.x, view.y);
            this.onDeselected();
        }
        layerBuilder.unitTurned = (unit) => {
            let view = this.unitView[unit.id];
            view.setFrame(unit.offset + unit.facing)
        };
        layerBuilder.wallsUpdated = (walls) => {
            walls.forEach(wall => {
                const key = `${wall.x}-${wall.y}`;
                if (wall.tileId) {
                    let existing = this.infrastructureViews[key];
                    if (existing) existing.destroy();
                    let { x, y } = this.screenCoordinates(wall.x, wall.y);
                    let obj = this.infrastructureBlitter.create(x, y, wall.tileId);
                    this.infrastructureViews[key] = obj;
                } else {
                    this.infrastructureViews[key].destroy();
                    delete this.infrastructureViews[key];
                }
            });
            this.sound.play('wbuild');
        };
        this.layerBuilder = layerBuilder;

        this.constructionMode = null;

        this.events.on(Phaser.Input.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP);
            this.input.off(Phaser.Input.Events.POINTER_MOVE);
            this.input.keyboard.off('keyup-H');
            this.events.off(Phaser.Input.Events.SHUTDOWN);
            this.layerBuilder.shutdown();
            this.layerBuilder = null;
        });
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', (_event) => {
            this.onDeselected();
        });

        registerButtons(this, buttons.strategic);

        preloadUnits(this);
        preloadStructures(this);

        ConstructionDialog.preload(this);
        StructureDialog.preload(this);
        MessageBox.preload(this);

        this.load.image('ui-strategic', Strategic);
        this.load.image('active-unit-selection', activeUnitSelection);

        this.currentGame = this.cache.json.get(`game-${this.gameId}`);
        const logo = this.currentGame.player.owner === 'HUMAN' ? LogoHuman : LogoAlien;
        this.load.image('logo', logo);

        preloadSounds(this, ['aargh', 'yessir', 'road', 'telep', 'wbuild', 'inout']);
        preloadTerrainForProvince(this, this.province);
    }

    onDeselected() {
        this.currentlySelectedUnit = null;
        this.constructionMode = null;
        this.onConstructionModeUpdated();
    }

    enterConstructionMode(reference) {
        this.constructionMode = {
            w: reference.display.width,
            h: reference.display.height,
            kind: 'structure',
            category: reference.kind.category,
            model: {
                title: "Construction",
                name: reference.kind.name,
                cost: reference.build.cost
            }
        };
        const tileIndex = this.map.tileToWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, true);
        this.updateCurrentConstructionGraphics(tileIndex);
        this.onConstructionModeUpdated();
    }

    onStructureSelected(model) {
        if (this.currentlySelectedUnit) {
            if (model.kind !== 'DROPSHIP' || Object.keys(model.units.current).length >= model.units.max) return;
            if (model.state === 'UNDER_CONSTRUCTION') return;

            this.commandQueue.dispatch({
                action: 'BOARD',
                province: this.province,
                targetId: this.currentlySelectedUnit.id,
                targetType: 'unit',
                dropship: model.id
            });
            return;
        }
        if (this.modalDialog) return;
        let province = this.currentGame.provinces[this.province];
        const dialog = new StructureDialog(this, 13, 28, province, this.currentGame.player.technology, model, "STRATEGIC", (_structure) => {
            this.modalDialog.destroy();
            this.modalDialog = null;
        }, (kind, context) => {
            this.modalDialog.destroy();
            this.modalDialog = null;

            switch (kind) {
                case 'FIRE':
                    // Technically you shouldn't be able to get here in Strategic mode, however
                    // when this code is moved into a shared location between strategic and tactical modes
                    // then this should target a specific place for firing a weapon
                    break;
                case 'BUILD_DROPSHIP':
                    const dropshipReference = Object.values(StructureData)
                        .find(s => s.kind.type === 'DROPSHIP' && s.kind.owner.indexOf(this.currentGame.player.owner) >= 0);
                    this.enterConstructionMode(dropshipReference);
                    break;
                case 'EXIT_STRUCTURE':
                    this.constructionMode = {
                        w: 1,
                        h: 1,
                        kind: 'pending-unit-exit',
                        model: {
                            name: context.unit.kind.name,
                            experience: context.unit.experience,
                            reference: context.reference,
                            unitId: context.id,
                            container: context.container
                        }
                    };
                    this.onConstructionModeUpdated();
                    break;
                case 'LAUNCH':
                    this.scene.start('Launch', {
                        mode: 'DROPSHIP',
                        from: this.province,
                        gameId: this.gameId,
                        dropship: model.id,
                        position: context.position
                    });
                    break;
                case 'MISSILE':
                    this.scene.start('Launch', {
                        mode: 'MISSILE',
                        from: this.province,
                        gameId: this.gameId
                    });
                    break;
            }
        })
        this.uiContainer.add(dialog);
        this.modalDialog = dialog;
        dialog.show();
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
            this.commandQueue.dispatch({
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

    onUnitDisembarked(model, container, pos) {
        this.commandQueue.dispatch(
            {
                action: 'DISEMBARK',
                province: this.province,
                targetId: model.id,
                targetType: model.type,
                position: pos,
                facing: 0, // always come out facing same direction
                containerId: container.id,
                containerType: container.type
            }
        )
    }

    onUnitMoved(model, pos) {
        this.commandQueue.dispatch(
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

        const hideModalDialog = () => {
            if (!this.modalDialog) return;
            this.modalDialog.hide();
            this.modalDialog = null;
        }

        if (this.constructionMode) {
            if (this.constructionMode.kind === 'pending-construction') {
                this.logo.visible = true;
                let player = this.currentGame.player;
                this.modalDialog = new ConstructionDialog(this, 16, 42, player.owner, (structure) => {
                    this.enterConstructionMode(structure);
                }).show();
                this.uiContainer.add(this.modalDialog);
                this.infoText.visible = false;
                this.activeUnitSelection.visible = false;
                this.currentlySelectedUnit = null;
                this.updateCurrentConstructionGraphics(null);
            } else if (this.constructionMode.kind === 'pending-unit-exit') {
                this.logo.visible = false;
                const { name, experience } = this.constructionMode.model;
                const { upkeep } = this.constructionMode.model.reference;
                this.infoText.setUnitMode(name, upkeep, experience).setVisible(true);
            } else {
                this.logo.visible = false;
                this.infoText.setConstructionMode(this.constructionMode).setVisible(true);
                this.activeUnitSelection.visible = false;
                this.currentlySelectedUnit = null;
                hideModalDialog();
            }
        } else if (this.currentlySelectedUnit) {
            this.logo.visible = false;
            const { name, upkeep, experience } = this.currentlySelectedUnit;
            this.infoText.setUnitMode(name, upkeep, experience).setVisible(true);
            hideModalDialog();
            // this hides the selection when using overview map with a selected unit to 
            // easily move it to another location
            this.activeUnitSelection.visible = !this.overviewProvince.visible;
        } else {
            this.logo.visible = true;
            this.infoText.visible = false;
            this.activeUnitSelection.visible = false;
            this.currentlySelectedUnit = null;
            this.updateCurrentConstructionGraphics(null);
            hideModalDialog();
        }
        this.onButtonsUpdated();
    }

    onOverviewToggled() {
        if (this.overviewProvince.visible) {
            this.overviewProvince.visible = false;
            this.overviewProvince.hide();
            // this.terrainLayer.visible = true;
        } else {
            this.constructionMode = null;
            this.overviewProvince.visible = true;
            this.overviewProvince.show(this.province, this.currentlySelectedUnit);
            // this.terrainLayer.visible = false;
        }

        this.onConstructionModeUpdated();
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

    renderUnit(unit, pos) {
        const unitImage = this.add.image(pos.x, pos.y, unit.spritesheet, unit.offset + unit.facing)
            .setOrigin(0, 0);

        // if we don't own this unit then don't allow us to select it
        if (unit.owner === this.currentGame.player.owner) {
            unitImage.setInteractive({ cursor: 'url(' + customPointer + '), pointer' });
            unitImage.on(Phaser.Input.Events.POINTER_UP, (_pointer, _x, _y, event) => {
                if (this.constructionMode) return;

                event.stopPropagation();
                this.onUnitSelected(unit, pos);
            });
        }

        this.unitView[unit.id] = unitImage;
        return unitImage;
    }

    renderStructure(structure, position) {
        const structureImage = this.add.image(position.x, position.y, structure.spritesheet, structure.offset)
            .setOrigin(0, 0)
            .setAlpha(structure.state === 'UNDER_CONSTRUCTION' ? 0.5 : 1.0);

        let views = this.structureViews[structure.id] || [];
        views.push(structureImage)
        this.structureViews[structure.id] = views;

        if (structure.owner === this.currentGame.player.owner) {
            structureImage.setInteractive({ cursor: 'url(' + structurePointer + '), pointer', pixelPerfect: true });
            structureImage.on(Phaser.Input.Events.POINTER_UP, (_pointer, _x, _y, _event) => {
                if (this.constructionMode) return;
                this.onStructureSelected(structure);
            });
        }
    }

    updateCurrentConstructionGraphics(tileIndex) {

        if (!(this.constructionMode || this.currentlySelectedUnit) || !tileIndex || (this.constructionMode && this.constructionMode.kind === 'pending-construction')) {
            // hide all tile selectors
            Object.values(this.cachedTileSelectors).forEach(graphics => { graphics.visible = false });
            return;
        }

        let pos = this.map.tileToWorldXY(tileIndex.x, tileIndex.y);

        // show the white square (and potentially add a cross through it when disabled) for:
        // - Taking a unit out of a structure
        // - Building a structure
        // - Moving a unit
        let enabledSelector;
        let size;
        if (this.constructionMode) {
            size = { x: this.constructionMode.w, y: this.constructionMode.h };
            if (this.constructionMode.kind === 'pending-unit-exit') {
                const { reference, container } = this.constructionMode.model;
                enabledSelector = this.presenter.unitCanDisembark(reference, container, tileIndex);
            } else {
                enabledSelector = this.presenter.validForConstruction(tileIndex, size, this.constructionMode.category);
            }
        } else if (this.currentlySelectedUnit) {
            // Assume all units are 1x1
            size = { x: 1, y: 1 };
            enabledSelector = this.presenter.unitCanOccupy(this.currentlySelectedUnit.movement, tileIndex);
        }

        let graphics = this.loadTileSelector(enabledSelector, size);
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
                // Walls are a special case because they are in the structures menu
                // without a dedicated button like a road, however they are infrastructure
                // so built in the same way as a road
                if (mode.category === "WALL") {
                    return {
                        action: 'WALL',
                        province: this.province,
                        targetId: null,
                        targetType: null,
                        position: tileIndex
                    }
                }
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

        let province = this.currentGame.provinces[this.province];
        this.presenter = new ProvinceIndexer(ProvinceData[this.province], province);

        const { map, terrain, structures, units } = buildMapDataForProvince(this, this.province, province);
        this.map = map;

        terrain.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (_pointer, dragX, dragY) => {
            this.cameras.main.setScroll(
                this.cameras.main.scrollX - (dragX / this.cameras.main.zoom),
                this.cameras.main.scrollY - (dragY / this.cameras.main.zoom)
            );
        });
        terrain.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, (pointer, _localX, _localY, event) => {
            if (((pointer.getDistance() < 5) && (pointer.upTime - pointer.downTime) < 250)) {
                let tileIndex = this.map.worldToTileXY(pointer.worldX, pointer.worldY, true);
                tileIndex.x -= 1;
                // TODO: do something with the selection
                console.log(`selected ${JSON.stringify(tileIndex)}`);
            }
        });

        this.cachedTileSelectors = {};

        // Render active unit selection
        this.activeUnitSelection = this.add.image(0, 0, 'active-unit-selection')
            .setOrigin(0.2, 0)
            .setVisible(false)
            .setDepth(2);

        this.uiCamera = this.cameras.add(0, 0, this.cameras.main.width, this.cameras.main.height)
            .setOrigin(0, 0)
            .ignore(this.map.layers.map(l => l.tilemapLayer));

        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer, _localX, _localY, _event) => {
            let tileIndex = this.map.worldToTileXY(pointer.worldX, pointer.worldY, true);
            tileIndex.x -= 1;
            this.updateCurrentConstructionGraphics(tileIndex);
        }, this);

        //     if (this.constructionMode) {
        //         if (this.constructionMode.kind === 'pending-unit-exit') {
        //             const { unitId, container, reference } = this.constructionMode.model;
        //             if (this.layerBuilder.unitCanDisembark(reference, container, tileIndex)) {
        //                 this.onUnitDisembarked({ id: unitId, type: 'unit' }, { id: container.id, type: container.type }, tileIndex);
        //             }
        //         } else {
        //             let size = { x: this.constructionMode.w, y: this.constructionMode.h };
        //             let validForConstruction = this.layerBuilder.validForConstruction(tileIndex, size, this.constructionMode.category);
        //             if (validForConstruction) {
        //                 let command = this.constructionCommand(this.constructionMode, tileIndex);
        //                 this.commandQueue.dispatch(command);
        //             }
        //         }
        //     } else if (this.overviewProvince.visible) {
        //         // find the selected tile
        //         tileIndex = {
        //             x: Math.floor((pointer.x - this.overviewProvince.x) / 7),
        //             y: Math.floor((pointer.y - this.overviewProvince.y) / 7),
        //         }
        //         // center it on the screen
        //         this.centerCameraAtPoint(tileIndex);
        //         // and hide the overview
        //         this.onOverviewToggled();
        //     } else if (this.currentlySelectedUnit) {
        //         // if we already have a selected unit
        //         if (this.layerBuilder.unitCanOccupy(this.currentlySelectedUnit.movement, tileIndex)) {
        //             this.onUnitMoved(this.currentlySelectedUnit, tileIndex);
        //         }
        //     }
        // }, this);

        // Static UI in a container
        let ui = this.add.container(0, 0).setDepth(2);

        this.overviewProvince = new ProvinceOverview(this, 32, 34, this.currentGame, ui).setVisible(false);
        ui.add(this.overviewProvince);
        this.buttonRepair = createButton(this, 12, 410, buttons.strategic.repair, (button) => {
            const dialog = new MessageBox(this, 160, 150, "Repair?", () => {
                dialog.destroy();
                this.commandQueue.dispatch({
                    action: 'REPAIR',
                    province: this.province,
                    targetId: this.province,
                    targetType: 'province'
                });
            }, () => {
                dialog.destroy();
            })
            this.add.existing(dialog);
            dialog.show();
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
                this.constructionMode = { w: 1, h: 1, kind: 'road', category: 'ROAD' };
            }
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonRoad);
        this.buttonRecycle = createButton(this, 161, 410, buttons.strategic.recycle, (button) => {
            if (this.constructionMode && this.constructionMode.kind === 'recycle') {
                this.constructionMode = null;
            } else {
                this.constructionMode = { w: 1, h: 1, kind: 'recycle', category: 'RECYCLE' };
            }
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonRecycle);
        this.buttonMap = createButton(this, 424, 410, buttons.strategic.map, (button) => { this.onOverviewToggled() });
        ui.add(this.buttonMap);
        this.buttonMenu = createButton(this, 486, 410, buttons.strategic.menu, (button) => {
            this.onDeselected();
            this.scene.start('MainMenu');
        });
        ui.add(this.buttonMenu);
        this.buttonColony = createButton(this, 563, 410, buttons.strategic.colony, (button) => {
            this.onDeselected();
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
            .on(Phaser.Input.Events.POINTER_UP, (_pointer, _x, _y, event) => {
                event.stopPropagation();
                this.onDeselected();
            });
        ui.add(infoTextZone);
        this.uiContainer = ui;

        this.cameras.main.ignore(ui);

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
        ui.add(this.add.text(58, 6, ResourceCalculator.calculateIncome(province, 'RESEARCH'), font).setOrigin(0.5, 0));
        ui.add(this.add.text(133, 6, ResourceCalculator.calculateIncome(province, 'ENERGY'), font).setOrigin(0.5, 0));
        ui.add(this.add.text(320, 6, province.name, font).setOrigin(0.5, 0));
        ui.add(this.add.text(569, 6, this.currentGame.player.globalReserve + "/" + ResourceCalculator.calculateIncome(province, 'CREDITS'), font).setOrigin(0.5, 0));

        const { x, y } = this.map.tileToWorldXY(this.map.width / 2, this.map.height / 2);
        this.input.keyboard.on('keyup-H', () => {
            this.cameras.main.zoom = 1;
            this.cameras.main.centerOn(x, y);
        });
        this.cameras.main.centerOn(x, y);
    }

    update(time, delta) {
        this.controls.update(delta);
    }
}
