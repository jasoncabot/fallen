import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';

import {
    MessageBox,
    ProvinceOverview,
    TechnologyOverview,
    ProvinceMap
} from '../components';

import { StrategicMap } from '../../images/ui';

import * as api from '../models/API';

import { registerScenePath } from './../components/History';

import { ProvinceData, ResourceCalculator } from 'shared';
import terrain from './../../images/terrain';

export default class StrategicOverview extends Scene {
    constructor() {
        super({
            key: 'StrategicOverview'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.view = data.view || 'overview';
    }

    preload() {
        ProvinceMap.preload(this);

        this.load.image('strategic-map', StrategicMap);

        this.load.spritesheet('rocky-overview', terrain.rocky.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('forest-overview', terrain.forest.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('desert-overview', terrain.desert.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('overlay-overview', terrain.overlay, { frameWidth: 7, frameHeight: 7 });

        registerButtons(this, buttons.world);
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId);

        const game = this.cache.json.get(`game-${this.gameId}`);

        // UI Buttons
        this.add.image(0, 0, 'strategic-map')
            .setOrigin(0, 0)
            .setScrollFactor(0);
        this.selectedProvince = this.selectedProvince ? this.selectedProvince : game.defaultProvince;

        this.mission = this.add.text(16, 380, "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana', wordWrap: { width: 152, useAdvancedWrap: true } })
            .setVisible(false);

        // province text overview
        const small = 2;
        const medium = 10;
        var oy = 38;
        this.provinceCapital = this.add.text(450, oy, "CAPITAL", { color: 'green', fontSize: '14px', fontFamily: 'Verdana' })
            .setVisible(false);
        this.provinceName = this.add.text(450, oy += (14 + small), "", { color: 'green', fontSize: '14px', fontFamily: 'Verdana' });
        this.provinceScannable = this.add.text(450, oy + (14 + small), "Out of scanning range", { color: 'red', fontSize: '14px', fontFamily: 'Verdana' })
            .setVisible(false);
        this.provinceTerrain = this.add.text(450, oy += (14 + small), "", { color: 'green', fontSize: '14px', fontFamily: 'Verdana' });
        this.provinceEnergyIncome = this.add.text(450, oy += (12 + medium), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceCreditsIncome = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceResearchIncome = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceEnergy = this.add.text(450, oy += (12 + medium), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceCredits = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceResearch = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceRadar = this.add.text(450, oy += (12 + medium), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceMissileDefense = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceMissileLauncher = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceDropships = this.add.text(450, oy += (12 + medium), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceUnitsInside = this.add.text(450, oy += (12 + medium), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceUnitsOutside = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceUnitsTotal = this.add.text(450, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.provinceTowersTotal = this.add.text(450, oy += (12 + medium), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });

        this.overviewProvince = this.add.existing(new ProvinceOverview(this, 32, 34, game, null).setScrollFactor(0).setVisible(false));
        this.technologyOverview = this.add.existing(new TechnologyOverview(this, 32, 34, game).setScrollFactor(0).setVisible(false));
        this.provinceMap = this.add.existing(new ProvinceMap(this, 32, 34, game, this.selectedProvince, (province) => {
            this.selectedProvince = province;
            this.onSelectedProvinceUpdated(game);
        }).setScrollFactor(0).setVisible(true));

        let topFont = { color: 'green', fontSize: '14px', fontFamily: 'Verdana' };
        this.add.text(112, 4, `Year ${game.turn.number}`, topFont).setOrigin(0.5, 0);
        this.add.text(320, 4, game.player.name, topFont).setOrigin(0.5, 0);
        // TODO: move this calculation somewhere sensible
        let totalIncome = Object.values(game.provinces)
            .filter(p => p.owner === game.player.owner)
            .map(p => ResourceCalculator.calculateIncome(p, 'CREDITS'))
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
            this.scene.start('ProvinceStrategic', {
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
                this.provinceMap.visible = false;
                this.overviewProvince.visible = true;
                this.buttonMenu.disable();
                this.buttonTechnology.disable();
                this.buttonZoom.setHighlight(true);
                this.buttonMap.disable();
                this.buttonEndTurn.disable();
                this.overviewProvince.show(this.selectedProvince, null);
                break;
            case 'technology':
                this.provinceMap.visible = false;
                this.overviewProvince.visible = false;
                this.technologyOverview.visible = true;
                this.buttonMenu.disable();
                this.buttonTechnology.setHighlight(true);
                this.buttonZoom.disable();
                this.buttonMap.disable();
                this.buttonEndTurn.disable();
                this.technologyOverview.show();
                this.provinceCapital.setVisible(false);
                this.provinceCredits.setVisible(false);
                this.provinceCreditsIncome.setVisible(false);
                this.provinceDropships.setVisible(false);
                this.provinceEnergy.setVisible(false);
                this.provinceEnergyIncome.setVisible(false);
                this.provinceMissileDefense.setVisible(false);
                this.provinceMissileLauncher.setVisible(false);
                this.provinceName.setVisible(false);
                this.provinceRadar.setVisible(false);
                this.provinceResearch.setVisible(false);
                this.provinceResearchIncome.setVisible(false);
                this.provinceScannable.setVisible(false);
                this.provinceTerrain.setVisible(false);
                this.provinceTowersTotal.setVisible(false);
                this.provinceUnitsInside.setVisible(false);
                this.provinceUnitsOutside.setVisible(false);
                this.provinceUnitsTotal.setVisible(false);
                this.mission.setVisible(false);
                break;
            default:
                this.provinceMap.visible = true;
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

    onSelectedProvinceUpdated(game) {
        const provinceData = ProvinceData[this.selectedProvince];
        const province = game.provinces[this.selectedProvince];

        const outOfScanningRange = game.scannableProvinces.indexOf(this.selectedProvince) < 0;

        this.provinceCapital.setVisible(province.capital);
        this.provinceName.setText(provinceData.name);
        this.provinceName.setVisible(true);
        this.provinceScannable.setVisible(outOfScanningRange);
        this.provinceTerrain.setText(provinceData.type);
        this.provinceTerrain.setVisible(!outOfScanningRange);

        this.provinceEnergyIncome.setText(`Energy income ${ResourceCalculator.calculateIncome(province, 'ENERGY')}`);
        this.provinceCreditsIncome.setText(`Credits income ${ResourceCalculator.calculateIncome(province, 'CREDITS')}`);
        this.provinceResearchIncome.setText(`Research income ${ResourceCalculator.calculateIncome(province, 'RESEARCH')}`);
        this.provinceEnergyIncome.setVisible(!outOfScanningRange);
        this.provinceCreditsIncome.setVisible(!outOfScanningRange);
        this.provinceResearchIncome.setVisible(!outOfScanningRange);

        const resourceLevelNames = { 5: "Poor", 10: "Average", 15: "Rich", 30: "Very rich" };
        this.provinceEnergy.setText(`Energy ${resourceLevelNames[provinceData.energy]}`);
        this.provinceCredits.setText(`Credits ${resourceLevelNames[provinceData.credits]}`);
        this.provinceResearch.setText(`Research ${resourceLevelNames[provinceData.research]}`);
        this.provinceEnergy.setVisible(!outOfScanningRange);
        this.provinceCredits.setVisible(!outOfScanningRange);
        this.provinceResearch.setVisible(!outOfScanningRange);

        this.provinceRadar.setText(`Radar: ${ResourceCalculator.hasStructureOfType('SCANNER')(province) ? "Yes" : "No"}`);
        this.provinceMissileDefense.setText(`Missile Defence: ${ResourceCalculator.hasStructureOfType('ANTIMISSILE')(province) ? "Yes" : "No"}`);
        this.provinceMissileLauncher.setText(`Missile Launcher: ${ResourceCalculator.hasStructureOfType('MISSILE')(province) ? "Yes" : "No"}`);
        this.provinceRadar.setVisible(!outOfScanningRange);
        this.provinceMissileDefense.setVisible(!outOfScanningRange);
        this.provinceMissileLauncher.setVisible(!outOfScanningRange);

        this.provinceDropships.setText(`Dropships ${ResourceCalculator.countStructureOfType('DROPSHIP')(province)}`);
        this.provinceDropships.setVisible(!outOfScanningRange);

        const units = {
            inside: ResourceCalculator.countUnitsInside(province),
            outside: ResourceCalculator.countUnitsOutside(province)
        }
        this.provinceUnitsInside.setText(`Units inside ${units.inside}`);
        this.provinceUnitsInside.setVisible(!outOfScanningRange);
        this.provinceUnitsOutside.setText(`Units outside ${units.outside}`);
        this.provinceUnitsOutside.setVisible(!outOfScanningRange);
        this.provinceUnitsTotal.setText(`Total units ${units.inside + units.outside}`);
        this.provinceUnitsTotal.setVisible(!outOfScanningRange);
        this.provinceTowersTotal.setText(`Towers ${ResourceCalculator.countStructureOfType('TOWER')(province)}`);
        this.provinceTowersTotal.setVisible(!outOfScanningRange);

        // out of scanning range? hide the zoom button
        if (outOfScanningRange) {
            this.buttonZoom.disable();
        } else {
            this.buttonZoom.enable();
        }

        // not owned? hide the map button
        const owned = province.owner === game.player.owner;
        if (owned) {
            this.buttonMap.enable();
        } else {
            this.buttonMap.disable();
        }

        // mission? show the details
        this.onMissionChanged(province.mission)
    }

    onMissionChanged(mission) {
        if (mission) {
            this.mission.visible = true;
            if (mission.description && mission.description.length > 0) {
                this.mission.setText(`MISSION\n${mission.description}\nObjective: ${mission.objective}\nReward: ${mission.reward}`);
            } else {
                this.mission.setText(`MISSION\nObjective: ${mission.objective}\nReward: ${mission.reward}`);
            }
        } else {
            this.mission.visible = false;
        }
    }
}
