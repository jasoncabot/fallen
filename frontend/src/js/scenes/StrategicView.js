import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';
import MessageBox from '../components/MessageBox';
import { data } from '../Config';

import strategicMap from '../../images/ui/strategic-map.png';
import { registerScenePath } from './../components/History';

import LayerBuilder from '../components/LayerBuilder';

import terrain from './../../images/terrain';

export default class StrategicView extends Scene {
    constructor() {
        super({
            key: 'StrategicView'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.view = data.view;
    }

    preload() {
        this.load.image('strategic-map', strategicMap);
        this.load.json('data-provinces', data("/provinces.json"));

        this.load.spritesheet('rocky-overview', terrain.rocky.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('forest-overview', terrain.forest.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('desert-overview', terrain.desert.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('overlay-overview', terrain.overlay, { frameWidth: 7, frameHeight: 7 });

        registerButtons(this, buttons.world);
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId);

        const game = this.cache.json.get(`game-${this.gameId}`);

        this.add.image(0, 0, 'strategic-map')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.selectedProvince = this.selectedProvince ? this.selectedProvince : game.defaultProvince;
        this.addProvinces(game);

        this.mission = this.add.text(16, 380, "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana', wordWrap: { width: 142, useAdvancedWrap: true } })
            .setVisible(false);

        this.overviewProvince = this.add.container(32, 34).setScrollFactor(0).setVisible(false);

        this.buttonMenu = createButton(this, 246, 401, buttons.world.menu, (button) => { alert('menu'); });
        this.buttonTechnology = createButton(this, 349, 399, buttons.world.technology, (button) => { alert('tech'); });
        this.buttonMap = createButton(this, 533, 365, buttons.world.map, (button) => {
            this.scene.start('Play', {
                gameId: this.gameId,
                province: this.selectedProvince,
                view: this.view
            });
        });
        this.buttonZoom = createButton(this, 411, 400, buttons.world.zoom, (button) => {
            if (this.currentState === 'zoom') {
                this.onCurrentViewChanged('overview', game);
            } else {
                this.onCurrentViewChanged('zoom', game);
            }
        });
        this.buttonEndTurn = createButton(this, 532, 433, buttons.world.endTurn, (button) => {

            const key = 'end-turn-key';
            let box = new MessageBox(key, 160, 150, this, 'End Strategic Turn?');
            box.confirm = () => {
                alert('ending turn');
                this.scene.remove(key);
            }
            box.cancel = () => {
                this.scene.remove(key);
            }
            this.scene.add(key, box, true);
        });

        this.onCurrentViewChanged('overview', game);
    }

    renderProvinceOverview(game) {
        let builder = new LayerBuilder(null);

        const data = {
            terrain: this.cache.json.get('data-provinces'),
            structures: this.cache.json.get('data-structures'),
            units: this.cache.json.get('data-units')
        }

        let province = game.provinces[this.selectedProvince];
        let terrain = data.terrain[this.selectedProvince];

        builder.initialise(province, data, terrain);

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

    onCurrentViewChanged(state, game) {
        switch (state) {
            case 'zoom':
                this.overviewMap.visible = false;
                this.renderProvinceOverview(game);
                this.overviewProvince.visible = true;
                this.buttonMenu.disable();
                this.buttonTechnology.disable();
                this.buttonZoom.setHighlight(true);
                this.buttonMap.disable();
                this.buttonEndTurn.disable();
                break;
            default:
                this.overviewMap.visible = true;
                this.overviewProvince.visible = false;
                this.buttonMenu.enable();
                this.buttonTechnology.enable();
                this.buttonZoom.setHighlight(false);
                this.buttonMap.enable();
                this.buttonEndTurn.enable();
                // ensure that all buttons/missions are in a consistent state
                this.onSelectedProvinceUpdated(game);
                break;
        }
        this.currentState = state;
    }

    addProvinces(game) {
        const provinceLookup = this.cache.json.get('data-provinces');

        let font = { color: 'green', fontSize: '32px', fontFamily: 'Verdana' };
        var y = 40;
        let provinceOptions = [];
        this.overviewMap = this.add.container(0, 0).setScrollFactor(0);
        Object.keys(game.provinces).forEach((province) => {
            let option = this.add.text(30, y, provinceLookup[province].name, font)
                .setInteractive()
                .setBackgroundColor(this.selectedProvince === province ? '#246B6C' : 'black')
                .on('pointerup', () => {
                    provinceOptions.forEach(selected => {
                        let colour = option === selected ? '#246B6C' : 'black';
                        selected.setBackgroundColor(colour)
                    });
                    this.selectedProvince = province;
                    this.onSelectedProvinceUpdated(game);
                });

            let subtext = this.add.text(30, y + 38,
                `energy: ${provinceLookup[province].energy}, credits: ${provinceLookup[province].credits}, research: ${provinceLookup[province].research}`,
                { color: 'green', fontSize: '14px', fontFamily: 'Verdana' });

            this.overviewMap.add(option);
            this.overviewMap.add(subtext);

            provinceOptions.push(option);
            y += 60;
        });
    }

    onSelectedProvinceUpdated(game) {
        let reference = this.cache.json.get('data-provinces')[this.selectedProvince];
        let data = game.provinces[this.selectedProvince];

        if (this.terrainBlitter) this.terrainBlitter.clear();
        if (this.overlayBlitter) this.overlayBlitter.clear();

        this.terrainBlitter = this.add.blitter(0, 0, reference.type + '-overview');
        this.overlayBlitter = this.add.blitter(0, 0, 'overlay-overview');
        this.overviewProvince.add(this.terrainBlitter);
        this.overviewProvince.add(this.overlayBlitter);

        // out of scanning range? hide the zoom button
        // TODO: don't just hardcode this :)
        const scannableProvinces = ['haven', 'eagle-nest'];
        const outOfScanningRange = scannableProvinces.indexOf(this.selectedProvince) < 0;
        if (outOfScanningRange) {
            this.buttonZoom.disable();
        } else {
            this.buttonZoom.enable();
        }

        // not owned? hide the map button
        const owned = data.owner === game.player.owner;
        if (owned) {
            this.buttonMap.enable();
        } else {
            this.buttonMap.disable();
        }

        // mission? show the details
        this.onMissionChanged(data.mission)
    }

    onMissionChanged(mission) {
        if (mission) {
            this.mission.visible = true;
            const text = `MISSION\n${mission.description}\nObjective: ${mission.objective}\nReward: ${mission.reward}`
            this.mission.setText(text);
        } else {
            this.mission.visible = false;
        }
    }
}
