import Phaser from 'phaser';

import Dialog from '../components/Dialog';
import { api } from '../Config';

// TODO: come up with a better way of referencing these images
import rocky from '../../images/terrain/rocky.png';
import desert from '../../images/terrain/desert.png';
import forest from '../../images/terrain/forest.png';
import uiStrategic from '../../images/ui/strategic.png';
import activeUnitSelection from '../../images/icons/active-unit-selection.png';
import logoAlien from '../../images/ui/logo-alien.png';
import logoHuman from '../../images/ui/logo-human.png';
import logoNeutral from '../../images/ui/logo-neutral.png';
import roads from '../../images/roads/roads.png';

import { registerUnits, registerStructures } from '../assets/Resources';
import { registerButtons, createButton, buttons } from '../assets/Buttons';

import customCursor from '../../images/misc/FALLEN_223.cur';
import customPointer from '../../images/misc/FALLEN_218.cur';
import structurePointer from '../../images/misc/FALLEN_218.cur';

import { Sounds } from './../assets/Sounds';

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
    }

    init(data) {
        this.gameId = data.gameId;
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

        this.load.image('logo-alien', logoAlien);
        this.load.image('logo-neutral', logoNeutral);
        this.load.image('logo-human', logoHuman);

        this.sounds.preload(this);

        // dynamic content
        this.load.json('game', api("/games/" + this.gameId));
    }

    onUnitSelected(unit, pos) {
        this.sound.play('yessir');
        this.activeUnitSelection.visible = true;
        this.activeUnitSelection.setPosition(pos.x, pos.y);
    }

    onUnitDeselected(pos) {
        this.activeUnitSelection.visible = false;
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
    drawTileSelector(graphics, enabled) {
        // enabled == whether to draw a cross through it or not for construction
        graphics.lineStyle(1, 0xFFFFFF, 1.0);
        graphics.beginPath();
        graphics.moveTo(34, 18);
        graphics.lineTo(0, 35);
        graphics.lineTo(0, 36);
        graphics.lineTo(34, 54);
        graphics.lineTo(35, 54);
        graphics.lineTo(70, 36);
        graphics.lineTo(70, 35);
        graphics.lineTo(35, 18);
        graphics.closePath();
        graphics.strokePath();
    }

    validForConstruction(tileIndex, map) {
        if (tileIndex.x < 0) return false;
        if (tileIndex.y < 0) return false;
        if (tileIndex.y >= map.height) return false;
        if (tileIndex.x >= map.height) return false;
        // TODO: if it's something that can't be 'constructed' hide the cursor
        return true;
    }

    writeTile(dest, position, spritesheet, index) {
        let row = dest[position.x];
        if (!row) {
            row = [];
            dest[position.x] = row;
        }
        row[position.y] = { spritesheet, name: "" + index }
    }

    create() {
        let game = this.cache.json.get('game');

        const data = {
            terrain: this.cache.json.get('data-provinces'),
            structures: this.cache.json.get('data-structures'),
            units: this.cache.json.get('data-units')
        }

        // dummy data let's just show haven
        let terrain = data.terrain.haven;
        let province = game.haven;

        // create province view
        let tileBlitter = this.add.blitter(0, 0, terrain.type);
        let roadBlitter = this.add.blitter(0, 0, 'roads');

        // create unit image lookup
        let unitImages = [];
        Object.values(province.units).forEach((unit) => {
            let reference = data.units[unit.kind.category];
            let displayOffset = reference.display.offset + unit.facing;
            this.writeTile(unitImages, { x: unit.position.x, y: unit.position.y },
                reference.display.tiles, displayOffset);
        });

        // create structure image lookup
        let structureImages = [];
        Object.values(province.structures).forEach((structure) => {
            // Each structure can consist of multiple tiles
            // this is where we turn 1 structure into the many tiles that are 
            // actually rendered on-screen
            let reference = data.structures[structure.kind.category];
            // paint column by column to the height in the y-axis
            let displayOffset = reference.display.offset;
            for (let x = 0; x < reference.display.width; x++) {
                for (let y = 0; y < reference.display.height; y++) {
                    let pos = { x: structure.position.x + x, y: structure.position.y + y };
                    this.writeTile(structureImages, pos, reference.display.tiles, displayOffset);
                    displayOffset += 1;
                }
            }
        });

        let scanLines = (terrain.height + terrain.width) - 1;
        var line = 0;
        while (line < scanLines) {
            for (let j = 0, i = line; j <= line; j++ , i--) {
                if (j >= terrain.width) continue;
                if (i >= terrain.height) continue;

                let pos = this.screenCoordinates(j, i);
                tileBlitter.create(pos.x, pos.y, terrain.tiles[i][j]);

                // render structures
                let structure = (structureImages[j] || [])[i];
                if (structure) {
                    this.add.image(pos.x, pos.y, structure.spritesheet, structure.name)
                        .setOrigin(0, 0)
                        .setInteractive({ cursor: 'url(' + structurePointer + '), pointer' });
                }

                // render units
                let unit = (unitImages[j] || [])[i];
                if (unit) {
                    this.add.image(pos.x, pos.y, unit.spritesheet, unit.name)
                        .setOrigin(0, 0)
                        .setInteractive({ cursor: 'url(' + customPointer + '), pointer' });
                }
            }
            line++;
        }

        // Render active unit selection
        this.activeUnitSelection = this.add.image(0, 0, 'active-unit-selection').setOrigin(0.2, 0);
        this.activeUnitSelection.visible = false;

        // Render tile selection

        let constructionGraphics = this.add.graphics(70, 54);
        constructionGraphics.visible = false;
        this.drawTileSelector(constructionGraphics, false);

        this.input.on('pointerdown', (pointer) => {
            if (this.topDialog) return;
            this.isDragging = true;
            this.touchStart = { x: pointer.x, y: pointer.y };
        }, this);
        this.input.on('pointerup', (pointer) => {

            let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);
            let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);
            if (this.constructionMode) {
                constructionGraphics.setPosition(pos.x, pos.y);
                constructionGraphics.visible = this.validForConstruction(tileIndex, terrain);

                // TODO: remove this debug line - it shouldn't trigger if we have performed another event
                // such as dragging the map
                roadBlitter.create(pos.x, pos.y, 8);
            } else {
                // check if we touched a unit
                let unit = (unitImages[tileIndex.x] || [])[tileIndex.y];
                if (unit) {
                    this.onUnitSelected(unit, pos);
                } else {
                    this.onUnitDeselected(pos);
                }
            }

            this.isDragging = false;
            this.touchStart = null;
        }, this);
        this.input.on('pointermove', (pointer) => {
            if (this.constructionMode) {
                let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);
                let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);
                constructionGraphics.setPosition(pos.x, pos.y);
                constructionGraphics.visible = this.validForConstruction(tileIndex, terrain);
            } else {
                constructionGraphics.visible = false;
            }

            // move the map
            if (!this.isDragging) return;

            this.cameras.main.scrollX += (this.touchStart.x - pointer.x);
            this.cameras.main.scrollY += (this.touchStart.y - pointer.y);
            this.touchStart = { x: pointer.x, y: pointer.y };
        }, this);
        this.input.on('pointerout', (pointer) => {
            this.isDragging = false;
            this.touchStart = null;
        }, this);
        this.input.setDefaultCursor('url(' + customCursor + '), pointer');

        // Static UI in a container
        let ui = this.add.container(0, 0).setScrollFactor(0);

        ui.add(createButton(this, 12, 410, buttons.strategic.repair, (button) => {
            alert('No buildings or dropships damaged');
        }));
        ui.add(createButton(this, 52, 410, buttons.strategic.build, (button) => {
            if (this.topDialog) {
                this.topDialog.dismiss();
                this.topDialog = null;
                // TODO: if this is a different key, show that instead
            } else if (this.scene.isSleeping('build')) {
                this.scene.wake('build');
                this.topDialog = this.scene.get('build');
            } else {
                let window = new Dialog('build', 16, 42, this);
                this.scene.add(window.key, window, true);
                this.topDialog = window;
            }
        }));
        ui.add(createButton(this, 113, 410, buttons.strategic.road, (button) => {
            if (this.constructionMode) {
                this.constructionMode = null;
            } else {
                this.constructionMode = { w: 1, h: 1, name: 'road' };
                this.activeUnitSelection.visible = false;
            }
        }));
        ui.add(createButton(this, 161, 410, buttons.strategic.recycle, (button) => { }));
        ui.add(createButton(this, 424, 410, buttons.strategic.map, (button) => { }));
        ui.add(createButton(this, 486, 410, buttons.strategic.menu, (button) => { }));
        ui.add(createButton(this, 563, 410, buttons.strategic.colony, (button) => { }));

        // TODO: not just logo-alien - depends on which team you are
        ui.add(this.add.image(232, 413, 'logo-alien').setOrigin(0, 0));

        ui.add(this.add.image(0, 0, 'ui-strategic').setOrigin(0, 0));

        var cursors = this.input.keyboard.createCursorKeys();

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.7
        });

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Courier' };
        ui.add(this.add.text(48, 7, province.research, font));
        ui.add(this.add.text(125, 7, province.energy, font));
        ui.add(this.add.text(300, 7, terrain.name, font));
        ui.add(this.add.text(540, 7, game.globalReserve + "/" + province.income, font));
    }

    update(time, delta) {
        this.controls.update(delta);
    }

    render() {
    }
}
