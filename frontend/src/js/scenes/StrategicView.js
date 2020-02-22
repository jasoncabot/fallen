import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';
import MessageBox from '../components/MessageBox';
import ProvinceOverview from '../components/ProvinceOverview';
import TechnologyOverview from '../components/TechnologyOverview';
import { data } from '../Config';
import * as api from '../models/API';

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
        this.view = data.view || 'overview';
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

        this.overviewProvince = this.add.existing(new ProvinceOverview(this, 32, 34, game).setScrollFactor(0).setVisible(false));
        this.technologyOverview = this.add.existing(new TechnologyOverview(this, 32, 34, game).setScrollFactor(0).setVisible(false));

        let topFont = { color: 'green', fontSize: '14px', fontFamily: 'Verdana' };
        this.add.text(112, 4, `Year ${game.turn.number}`, topFont).setOrigin(0.5, 0);
        this.add.text(320, 4, game.player.name, topFont).setOrigin(0.5, 0);
        // TODO: move this calculation somewhere sensible
        let totalIncome = Object.values(game.provinces)
            .filter(p => p.owner === game.player.owner)
            .map(p => p.credits)
            .reduce((total, current) => total + current);
        this.add.text(538, 4, game.player.globalReserve + "/" + totalIncome, topFont).setOrigin(0.5, 0);

        this.buttonMenu = createButton(this, 246, 401, buttons.world.menu, (button) => {
            this.scene.start('MainMenu');
        });
        this.buttonTechnology = createButton(this, 349, 399, buttons.world.technology, (button) => {
            if (this.view === 'technology') {
                this.onCurrentViewChanged('overview', game);
            } else {
                this.onCurrentViewChanged('technology', game);
            }
        });
        this.buttonMap = createButton(this, 533, 365, buttons.world.map, (button) => {
            this.scene.start('Play', {
                gameId: this.gameId,
                province: this.selectedProvince,
                view: this.view
            });
        });
        this.buttonZoom = createButton(this, 411, 400, buttons.world.zoom, (button) => {
            if (this.view === 'zoom') {
                this.onCurrentViewChanged('overview', game);
            } else {
                this.onCurrentViewChanged('zoom', game);
            }
        });
        this.buttonEndTurn = createButton(this, 532, 433, buttons.world.endTurn, (button) => {

            const key = 'end-turn-key';
            let box = new MessageBox(key, 160, 150, this, 'End Strategic Turn?');
            box.confirm = () => {
                this.scene.remove(key);
                this.onTurnEnded(game);
            }
            box.cancel = () => {
                this.scene.remove(key);
            }
            this.scene.add(key, box, true);
        });

        this.onCurrentViewChanged(this.view, game);
    }

    onTurnEnded(game) {
        const data = {
            action: game.turn.action,
            actions: [], // TODO: submit the actual actions we performed this turn
            turn: game.turn.number
        }
        api.post(`/games/${game.id}/turn`, data)
            .then(turn => {
                this.cache.json.remove(`game-${game.id}`);
                this.scene.start('LoadGameResources', { gameId: game.id });
            })
            .catch(e => {
                alert(e);
            });
    }

    onCurrentViewChanged(view, game) {
        switch (view) {
            case 'zoom':
                this.overviewMap.visible = false;
                this.overviewProvince.visible = true;
                this.buttonMenu.disable();
                this.buttonTechnology.disable();
                this.buttonZoom.setHighlight(true);
                this.buttonMap.disable();
                this.buttonEndTurn.disable();
                this.overviewProvince.show(this.selectedProvince);
                break;
            case 'technology':
                this.overviewMap.visible = false;
                this.technologyOverview.visible = true;
                this.buttonMenu.disable();
                this.buttonTechnology.setHighlight(true);
                this.buttonZoom.disable();
                this.buttonMap.disable();
                this.buttonEndTurn.disable();
                this.technologyOverview.show();
                break;
            default:
                this.overviewMap.visible = true;
                this.overviewProvince.visible = false;
                this.technologyOverview.visible = false;
                this.buttonMenu.enable();
                this.buttonTechnology.enable();
                this.buttonZoom.enable();
                this.buttonMap.enable();
                this.buttonEndTurn.enable();

                // ensure that all buttons/missions are in a consistent state
                this.buttonZoom.setHighlight(false);
                this.buttonTechnology.setHighlight(false);
                this.overviewProvince.hide();
                this.technologyOverview.hide();
                this.onSelectedProvinceUpdated(game);
                break;
        }
        this.view = view;
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
        let data = game.provinces[this.selectedProvince];

        // out of scanning range? hide the zoom button
        const outOfScanningRange = game.scannableProvinces.indexOf(this.selectedProvince) < 0;
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
