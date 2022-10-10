import Phaser, { Scene } from 'phaser';

import { CommandEnvelope, PlayerGameProjection, MissionOverview, provinceForKey } from '../../shared/index';

import * as api from '../models/API';

import { calculateIncome, calculateTotalIncome, countStructureOfType, countUnitsInside, countUnitsOutside, hasStructureOfType, ProvinceKey } from '../../shared/index';

import { createButton, CustomButton, registerButtons, world } from '../assets/Buttons';
import terrain from './../images/terrain';
import StrategicMap from './../images/ui/strategic-map.png';
import { registerScenePath } from './History';
import MessageBox from './MessageBox';
import ProvinceMap from './ProvinceMap';
import ProvinceOverview from './ProvinceOverview';
import TechnologyOverview from './TechnologyOverview';
import { strategicCommandBus } from '../features/strategic/session';

export type InGameView = "zoom" | "technology" | "overview";

export default class StrategicOverview extends Scene {
    gameId!: string;
    view!: InGameView;
    selectedProvince!: ProvinceKey
    mission!: Phaser.GameObjects.Text;
    provinceCapital!: Phaser.GameObjects.Text;
    provinceName!: Phaser.GameObjects.Text;
    provinceScannable!: Phaser.GameObjects.Text;
    provinceTerrain!: Phaser.GameObjects.Text;
    provinceEnergyIncome!: Phaser.GameObjects.Text;
    provinceCreditsIncome!: Phaser.GameObjects.Text;
    provinceResearchIncome!: Phaser.GameObjects.Text;
    provinceEnergy!: Phaser.GameObjects.Text;
    provinceCredits!: Phaser.GameObjects.Text;
    provinceResearch!: Phaser.GameObjects.Text;
    provinceRadar!: Phaser.GameObjects.Text;
    provinceMissileDefense!: Phaser.GameObjects.Text;
    provinceMissileLauncher!: Phaser.GameObjects.Text;
    provinceDropships!: Phaser.GameObjects.Text;
    provinceUnitsInside!: Phaser.GameObjects.Text;
    provinceUnitsOutside!: Phaser.GameObjects.Text;
    provinceUnitsTotal!: Phaser.GameObjects.Text;
    provinceTowersTotal!: Phaser.GameObjects.Text;
    overviewProvince!: ProvinceOverview;
    technologyOverview!: TechnologyOverview;
    provinceMap!: ProvinceMap;
    buttonMenu!: CustomButton;
    buttonTechnology!: CustomButton;
    buttonMap!: CustomButton;
    buttonZoom!: CustomButton;
    buttonEndTurn!: CustomButton;

    constructor() {
        super({
            key: 'StrategicOverview'
        });
    }

    init(data: { gameId: string, view?: InGameView}) {
        this.gameId = data.gameId;
        this.view = data.view || 'overview';
        
        // Fallback: extract gameId from URL if not provided (helps with hot reload)
        if (!this.gameId) {
            const match = window.location.pathname.match(/\/games\/([^/]+)/);
            if (match) {
                this.gameId = match[1];
                console.log('🔄 StrategicOverview: Extracted gameId from URL:', this.gameId);
            }
        }
        
        console.log('🔄 StrategicOverview: init -', { gameId: this.gameId, view: this.view });
    }

    preload() {
        ProvinceMap.preload(this);
        MessageBox.preload(this);

        this.load.image('strategic-map', StrategicMap);

        this.load.spritesheet('rocky-overview', terrain.rocky.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('forest-overview', terrain.forest.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('desert-overview', terrain.desert.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('overlay-overview', terrain.overlay, { frameWidth: 7, frameHeight: 7 });

        registerButtons(this, world);
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId);

        const cacheKey = `game-${this.gameId}`;
        const game = this.cache.json.get(cacheKey) as PlayerGameProjection;
        
        if (!game) {
            console.error('❌ StrategicOverview: Game data not found in cache:', cacheKey);
            console.log('📋 Available cache keys:', Object.keys(this.cache.json.getKeys()));
            
            // Display error message on screen
            this.add.text(320, 240, 'ERROR: Game data not loaded', {
                fontSize: '24px',
                color: '#ff0000',
                align: 'center'
            }).setOrigin(0.5, 0.5);
            return;
        }
        
        console.log('✓ StrategicOverview: Game data loaded:', game.id);

        // UI Buttons
        this.add.image(0, 0, 'strategic-map')
            .setOrigin(0, 0)
            .setScrollFactor(0);
        this.selectedProvince = this.selectedProvince ? this.selectedProvince : game.defaultProvince as unknown as ProvinceKey;

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
        this.provinceMap = this.add.existing(new ProvinceMap(this, 32, 34, game, this.selectedProvince, (province: ProvinceKey) => {
            this.selectedProvince = province;
            this.onSelectedProvinceUpdated(game);
        }).setScrollFactor(0).setVisible(true));

        let topFont = { color: 'green', fontSize: '14px', fontFamily: 'Verdana' };
        this.add.text(112, 4, `Year ${game.turn.number}`, topFont).setOrigin(0.5, 0);
        this.add.text(320, 4, game.player.name, topFont).setOrigin(0.5, 0);
        let totalIncome = calculateTotalIncome(game, 'CREDITS');
        this.add.text(538, 4, game.player.globalReserve + "/" + totalIncome, topFont).setOrigin(0.5, 0);

        this.buttonMenu = createButton(this, 246, 401, world.menu, (button) => {
            this.scene.start('MainMenu');
        });
        this.buttonTechnology = createButton(this, 349, 399, world.technology, (button) => {
            if (this.view === 'technology') {
                this.onCurrentViewChanged('overview', game);
            } else {
                this.onCurrentViewChanged('technology', game);
            }
        });
        this.buttonMap = createButton(this, 533, 365, world.map, (button) => {
            this.scene.start('ProvinceStrategic', {
                gameId: this.gameId,
                province: this.selectedProvince,
                view: this.view
            });
        });
        this.buttonZoom = createButton(this, 411, 400, world.zoom, (button) => {
            if (this.view === 'zoom') {
                this.onCurrentViewChanged('overview', game);
            } else {
                this.onCurrentViewChanged('zoom', game);
            }
        });
        this.buttonEndTurn = createButton(this, 532, 433, world.endTurn, (_button): void => {
            const dialog = new MessageBox(this, 160, 150, "End Strategic Turn?", () => {
                dialog.destroy();
                this.onTurnEnded(game);
            }, () => {
                dialog.destroy();
            })
            this.add.existing(dialog);
            dialog.show();
        });

        this.onCurrentViewChanged(this.view, game);
    }

    async onTurnEnded(game: PlayerGameProjection) {
        const pending = strategicCommandBus
            .getPendingEnvelopesForGame(game.id)
            .sort((left, right) => left.expectedAction - right.expectedAction);

        const endTurnEnvelope: CommandEnvelope = {
            commandId: crypto.randomUUID(),
            gameId: game.id,
            scope: 'GAME',
            actorPlayerId: game.playerId,
            turnNumber: game.turn.number,
            expectedAction: game.turn.action + pending.length,
            mode: game.turn.kind,
            issuedAtMs: Date.now(),
            command: { type: 'END_TURN' },
        };

        try {
            for (const envelope of [...pending, endTurnEnvelope]) {
                const response = await api.post<{ accepted: boolean; reason?: string }>(`/games/${game.id}/commands`, envelope);
                if (!response.accepted) {
                    throw new Error(response.reason || 'Command rejected');
                }
            }

            strategicCommandBus.clearGame(game.id);
            this.cache.json.remove(`game-${game.id}`);
            this.scene.start('LoadGameResources', { gameId: game.id });
        } catch (error) {
            console.error('failed to submit strategic turn:', error);
        }
    }

    onCurrentViewChanged(view: InGameView, game: PlayerGameProjection) {
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

    onSelectedProvinceUpdated(game: PlayerGameProjection) {
        const provinceData = provinceForKey(this.selectedProvince);
        const province = game.provinces[this.selectedProvince];

        if (!province) {
            console.warn(`⚠️ StrategicOverview: Missing selected province state '${this.selectedProvince}'`);
            this.provinceName.setText(String(this.selectedProvince));
            this.provinceScannable.setVisible(true);
            this.buttonMap.disable();
            this.buttonZoom.disable();
            this.onMissionChanged({ description: '', objective: '', reward: '' });
            return;
        }

        if (!provinceData) {
            console.warn(`⚠️ StrategicOverview: Missing selected province lookup '${this.selectedProvince}'`);
            this.provinceName.setText(String(this.selectedProvince));
            this.provinceScannable.setVisible(false);
            this.provinceTerrain.setText('Unknown');
            this.provinceTerrain.setVisible(true);
            this.buttonMap.disable();
            this.buttonZoom.disable();
            this.onMissionChanged(province.mission);
            return;
        }

        const outOfScanningRange = game.scannableProvinces.indexOf(String(this.selectedProvince)) < 0;

        this.provinceCapital.setVisible(province.capital === game.player.owner);
        this.provinceName.setText(provinceData.name()!);
        this.provinceName.setVisible(true);
        this.provinceScannable.setVisible(outOfScanningRange);
        this.provinceTerrain.setText(provinceData.type()!.toString());
        this.provinceTerrain.setVisible(!outOfScanningRange);

        this.provinceEnergyIncome.setText(`Energy income ${calculateIncome(province, 'ENERGY')}`);
        this.provinceCreditsIncome.setText(`Credits income ${calculateIncome(province, 'CREDITS')}`);
        this.provinceResearchIncome.setText(`Research income ${calculateIncome(province, 'RESEARCH')}`);
        this.provinceEnergyIncome.setVisible(!outOfScanningRange);
        this.provinceCreditsIncome.setVisible(!outOfScanningRange);
        this.provinceResearchIncome.setVisible(!outOfScanningRange);

        const resourceLevelNames = { 5: "Poor", 10: "Average", 15: "Rich", 30: "Very rich" } as Record<number, string>;
        this.provinceEnergy.setText(`Energy ${resourceLevelNames[provinceData.energy()]}`);
        this.provinceCredits.setText(`Credits ${resourceLevelNames[provinceData.credits()]}`);
        this.provinceResearch.setText(`Research ${resourceLevelNames[provinceData.research()]}`);
        this.provinceEnergy.setVisible(!outOfScanningRange);
        this.provinceCredits.setVisible(!outOfScanningRange);
        this.provinceResearch.setVisible(!outOfScanningRange);

        this.provinceRadar.setText(`Radar: ${hasStructureOfType('SCANNER')(province) ? "Yes" : "No"}`);
        this.provinceMissileDefense.setText(`Missile Defence: ${hasStructureOfType('ANTIMISSILE')(province) ? "Yes" : "No"}`);
        this.provinceMissileLauncher.setText(`Missile Launcher: ${hasStructureOfType('MISSILE')(province) ? "Yes" : "No"}`);
        this.provinceRadar.setVisible(!outOfScanningRange);
        this.provinceMissileDefense.setVisible(!outOfScanningRange);
        this.provinceMissileLauncher.setVisible(!outOfScanningRange);

        this.provinceDropships.setText(`Dropships ${countStructureOfType('DROPSHIP')(province)}`);
        this.provinceDropships.setVisible(!outOfScanningRange);

        const units = {
            inside: countUnitsInside(province),
            outside: countUnitsOutside(province)
        }
        this.provinceUnitsInside.setText(`Units inside ${units.inside}`);
        this.provinceUnitsInside.setVisible(!outOfScanningRange);
        this.provinceUnitsOutside.setText(`Units outside ${units.outside}`);
        this.provinceUnitsOutside.setVisible(!outOfScanningRange);
        this.provinceUnitsTotal.setText(`Total units ${units.inside + units.outside}`);
        this.provinceUnitsTotal.setVisible(!outOfScanningRange);
        this.provinceTowersTotal.setText(`Towers ${countStructureOfType('TOWER')(province)}`);
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

    onMissionChanged(mission: MissionOverview) {
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
