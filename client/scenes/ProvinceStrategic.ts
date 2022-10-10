import { calculateIncome, PlayerGameProjection, provinceForKey, ProvinceKey, StrategicCommand, StructureData, StructureIdentifier, StructureEntityState, StructureValue, UnitData, UnitIdentifier, UnitEntityState } from '../../shared/index';
import Phaser from 'phaser';
import { createButton, CustomButton, registerButtons, strategic } from '../assets/Buttons';
import { registerStructures, registerUnits } from '../assets/Resources';
import { Sounds } from '../assets/Sounds';
import activeUnitSelection from '../images/icons/active-unit-selection.png';
import terrain from '../images/terrain';
import logoAlien from '../images/ui/logo-alien.png';
import logoHuman from '../images/ui/logo-human.png';
import uiStrategic from '../images/ui/strategic.png';
import ConstructionDialog from './ConstructionDialog';
import { registerScenePath } from './History';
import InfoText from './InfoText';
import { LaunchDataDropship, LaunchDataMissile } from './Launch';
import StrategicProjectionAdapter from '../features/strategic/adapters/StrategicProjectionAdapter';
import MessageBox from './MessageBox';
import ProvinceOverview from './ProvinceOverview';
import { InGameView } from './StrategicOverview';
import StructureDialog from './StructureDialog';
import StrategicStore, { buildConstructionCommand, StrategicMessage } from '../features/strategic/store';
import StrategicRuntime from '../features/strategic/runtime';
import StrategicCommandBus from '../features/strategic/command-bus';
import { ConstructionMode, ConstructionModelUnit } from '../features/strategic/construction';
import { HttpStrategicCommandTransport } from '../features/strategic/transport';
import { StrategicProjectionAdapterPort, StrategicRuntimeCommandContext } from '../features/strategic/ports';
import { strategicCommandBus } from '../features/strategic/session';

// import customPointer from '../images/icons/FALLEN_218.ico';

const TERRAIN_TEXTURE_KEYS = ['desert', 'forest', 'rocky'] as const;

export default class ProvinceStrategic extends Phaser.Scene {
    gameId!: string;
    currentGame!: PlayerGameProjection;

    constructionMode: ConstructionMode | null;
    currentlySelectedUnit: UnitEntityState | null;
    tileSize: { w: number; h: number; };
    sounds: Sounds;
    province!: ProvinceKey;
    view?: InGameView;
    infrastructureBlitter!: Phaser.GameObjects.Blitter;
    terrainBlitter!: Phaser.GameObjects.Blitter;
    infrastructureViews!: Record<string, Phaser.GameObjects.Bob>;
    structureViews!: Record<string, Phaser.GameObjects.Image[]>;
    unitView!: Record<string, Phaser.GameObjects.Image>;
    mapContainer!: Phaser.GameObjects.Container;
    projectionAdapter: StrategicProjectionAdapterPort | null;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    activeUnitSelection!: Phaser.GameObjects.Image;
    uiCamera!: Phaser.Cameras.Scene2D.Camera;
    modalDialog: StructureDialog | ConstructionDialog | null;
    overviewProvince!: ProvinceOverview;
    buttonRepair!: CustomButton;
    buttonBuild!: CustomButton;
    buttonRoad!: CustomButton;
    buttonRecycle!: CustomButton;
    buttonMap!: CustomButton;
    buttonMenu!: CustomButton;
    buttonColony!: CustomButton;
    logo!: Phaser.GameObjects.Image;
    infoText!: InfoText;
    uiContainer!: Phaser.GameObjects.Container;
    cachedTileSelectors!: Record<string, Phaser.GameObjects.Graphics>;
    strategicStore!: StrategicStore;
    strategicRuntime!: StrategicRuntime;
    strategicCommandBus!: StrategicCommandBus;
    controls!: Phaser.Cameras.Controls.FixedKeyControl;

    constructor() {
        super({
            key: 'ProvinceStrategic'
        });

        this.constructionMode = null;
        this.projectionAdapter = null;
        this.currentlySelectedUnit = null;
        this.modalDialog = null;

        this.tileSize = {
            w: 70 / 2,
            h: 36
        };

        this.sounds = new Sounds();
    }

    init(data: { gameId: string, province: ProvinceKey, view: InGameView }) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view;

        this.strategicStore = new StrategicStore();
        this.strategicCommandBus = strategicCommandBus;
        this.strategicRuntime = new StrategicRuntime({
            store: this.strategicStore,
            bus: this.strategicCommandBus,
            transport: new HttpStrategicCommandTransport(),
            callbacks: {
                onPlaySound: (sound) => this.sound.play(sound),
                onOptimisticCommand: (command) => {
                    this.projectionAdapter?.processStrategicCommand(command);
                    this.syncProjectionRender();
                    this.syncUiFromState();
                    this.onConstructionModeUpdated();
                },
            },
        });

        const projectionAdapter = new StrategicProjectionAdapter();
        this.projectionAdapter = projectionAdapter;

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.projectionAdapter = null;
        });
    }

    preload() {
        const keyboard = this.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input is unavailable');
        }
        this.cursors = keyboard.createCursorKeys();

        keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', (_event: KeyboardEvent) => {
            this.onDeselected();
        });

        this.load.spritesheet('rocky', terrain.rocky.isometric, { frameWidth: 70, frameHeight: 54 });
        this.load.spritesheet('forest', terrain.forest.isometric, { frameWidth: 70, frameHeight: 54 });
        this.load.spritesheet('desert', terrain.desert.isometric, { frameWidth: 70, frameHeight: 54 });

        this.load.spritesheet('rocky-overview', terrain.rocky.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('forest-overview', terrain.forest.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('desert-overview', terrain.desert.overview, { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet('overlay-overview', terrain.overlay, { frameWidth: 7, frameHeight: 7 });

        registerButtons(this, strategic);

        registerUnits(this);
        registerStructures(this);

        ConstructionDialog.preload(this);
        StructureDialog.preload(this);
        MessageBox.preload(this);

        this.load.image('ui-strategic', uiStrategic);
        this.load.image('active-unit-selection', activeUnitSelection);

        this.currentGame = this.cache.json.get(`game-${this.gameId}`) as PlayerGameProjection;
        const logo = this.currentGame.player.owner === 'HUMAN' ? logoHuman : logoAlien;
        this.load.image('logo', logo);

        this.sounds.preload(this);
    }

    private commandContext(): StrategicRuntimeCommandContext {
        return {
            gameId: this.gameId,
            actorPlayerId: this.currentGame.playerId,
            turnNumber: this.currentGame.turn.number,
            expectedAction: this.currentGame.turn.action,
        };
    }

    private syncUiFromState() {
        const runtimeState = this.strategicRuntime.state;
        this.constructionMode = runtimeState.ui.constructionMode;
        this.currentlySelectedUnit = runtimeState.ui.selectedUnitId
            ? this.projectionAdapter?.unitLookup?.[runtimeState.ui.selectedUnitId] || null
            : null;
    }

    private dispatchStrategic(message: StrategicMessage) {
        this.strategicRuntime.dispatch(message, this.commandContext());
        this.syncUiFromState();
    }

    onDeselected() {
        this.dispatchStrategic({ type: 'CLEAR_SELECTION' });
        this.onConstructionModeUpdated();
    }

    enterConstructionMode(reference: StructureValue) {
        this.dispatchStrategic({
            type: 'SET_CONSTRUCTION_MODE',
            mode: {
            w: reference.display.width!,
            h: reference.display.height!,
            kind: 'structure',
            category: reference.kind.category,
            model: {
                title: "Construction",
                name: reference.kind.name,
                cost: reference.build.cost
            }
            },
        });
        const tileIndex = this.tileIndexFromCoordinates(this.input.activePointer.worldX, this.input.activePointer.worldY);
        this.updateCurrentConstructionGraphics(tileIndex);
        this.onConstructionModeUpdated();
    }

    onStructureSelected(model: StructureEntityState) {
        if (this.currentlySelectedUnit) {
            const canBoard = model.kind.type === 'DROPSHIP'
                && Object.keys(model.units.current).length < model.units.max
                && model.state !== 'UNDER_CONSTRUCTION';
            this.dispatchStrategic({
                type: 'STRUCTURE_BOARD_REQUEST',
                province: this.province,
                unit: this.currentlySelectedUnit,
                dropshipId: model.id,
                canBoard,
            });
            return;
        }
        if (this.modalDialog) return;
        let province = this.currentGame.provinces[this.province];
        const dialog = new StructureDialog(this, 13, 28, province, this.currentGame.player.technology, model, "STRATEGIC", (_structure) => {
            this.modalDialog?.destroy();
            this.modalDialog = null;
        }, (kind, context) => {
            this.modalDialog?.destroy();
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
                    if (dropshipReference) this.enterConstructionMode(dropshipReference);
                    break;
                case 'EXIT_STRUCTURE':
                    const model: ConstructionModelUnit = {
                        name: context.unit!.kind.name,
                        experience: context.unit!.experience,
                        unitReference: context.unitReference!,
                        unitId: context.unit!.id,
                        container: context.container
                    }
                    const nextMode: ConstructionMode = {
                        w: 1,
                        h: 1,
                        kind: 'pending-unit-exit',
                        model: model
                    };
                    this.dispatchStrategic({
                        type: 'SET_CONSTRUCTION_MODE',
                        mode: nextMode,
                    });
                    this.onConstructionModeUpdated();
                    break;
                case 'LAUNCH':
                    this.scene.start('Launch', {
                        mode: 'DROPSHIP',
                        from: this.province,
                        gameId: this.gameId,
                        dropship: context.container.id,
                        position: context.container.position,
                    } as LaunchDataDropship);
                    break;
                case 'MISSILE':
                    this.scene.start('Launch', {
                        mode: 'MISSILE',
                        from: this.province,
                        gameId: this.gameId
                    } as LaunchDataMissile);
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

        // TODO: customCursor
        // this.input.setDefaultCursor(`url('${customCursor}'), pointer`);
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

    onUnitSelected(model: UnitEntityState, _pos: { x: number, y: number }) {
        if (this.currentlySelectedUnit && this.currentlySelectedUnit === model) {
            this.dispatchStrategic({
                type: 'UNIT_TURN_REQUEST',
                province: this.province,
                unit: model,
            });
            return;
        }

        this.dispatchStrategic({
            type: 'UNIT_SELECTED',
            unit: model,
        });
        let view = this.unitView[model.id];
        this.activeUnitSelection.setPosition(view.x, view.y);
        this.onConstructionModeUpdated();
    }

    onUnitDisembarked(model: { id: string, type: 'unit' }, container: { id: string, type: 'structure' }, pos: { x: number, y: number }) {
        this.dispatchStrategic({
            type: 'UNIT_DISEMBARK_REQUEST',
            province: this.province,
            unitId: model.id,
            containerId: container.id,
            containerType: container.type,
            tileIndex: pos,
            canDisembark: true,
        });
    }

    onUnitMoved(model: UnitEntityState, pos: { x: number, y: number }) {
        this.dispatchStrategic({
            type: 'UNIT_MOVE_REQUEST',
            province: this.province,
            unit: model,
            tileIndex: pos,
            canOccupy: true,
        });
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
                this.modalDialog = new ConstructionDialog(this, 16, 42, player.owner, (structure: StructureValue) => {
                    this.enterConstructionMode(structure);
                }).show();
                this.uiContainer.add(this.modalDialog);
                this.infoText.visible = false;
                this.activeUnitSelection.visible = false;
                this.currentlySelectedUnit = null;
                this.updateCurrentConstructionGraphics();
            } else if (this.constructionMode.kind === 'pending-unit-exit') {
                this.logo.visible = false;
                const unitModel = this.constructionMode.model as ConstructionModelUnit;
                this.infoText.setUnitMode(unitModel.name, unitModel.unitReference.upkeep, unitModel.experience).setVisible(true);
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
            this.updateCurrentConstructionGraphics();
            hideModalDialog();
        }
        this.onButtonsUpdated();
    }

    onOverviewToggled() {
        this.dispatchStrategic({ type: 'TOGGLE_OVERVIEW' });
        if (this.overviewProvince.visible) {
            this.overviewProvince.visible = false;
            this.overviewProvince.hide();
            this.mapContainer.visible = true;
        } else {
            this.overviewProvince.visible = true;
            this.overviewProvince.show(this.province, this.currentlySelectedUnit);
            this.mapContainer.visible = false;
        }

        this.onConstructionModeUpdated();
    }

    // Converts pointer coordinates to tile x, y
    tileIndexFromCoordinates(x: number, y: number) {
        let h = this.tileSize.h;
        let w = this.tileSize.w * 2;
        x = x - (w / 2.0);
        y = y - (h / 2.0);
        return {
            x: Math.floor((x / (w / 2.0) + y / (h / 2.0)) / 2.0),
            y: Math.floor((y / (h / 2.0) - (x / (w / 2.0))) / 2.0)
        };
    }

    screenCoordinates(x: number, y: number) {
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
    loadTileSelector(enabled: boolean, size: { x: number, y: number }) {
        let { x, y } = size;
        let key = `${x}-${y}-${enabled}`;

        if (this.cachedTileSelectors[key]) {
            return this.cachedTileSelectors[key];
        }

        let graphics = this.add.graphics({ x: (35 + (35 * x)) - (35 - (35 * y)), y: 19 + (18 * x) + (18 * y) });
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

    pointerUpNearPointerDown(downStart: { x: number, y: number }) {
        const tolerance = 5;
        const movedX = Math.abs(Math.round(this.cameras.main.scrollX) - downStart.x) > tolerance;
        const movedY = Math.abs(Math.round(this.cameras.main.scrollY) - downStart.y) > tolerance;
        return !movedX && !movedY
    }

    private clearDynamicViews() {
        Object.values(this.infrastructureViews).forEach((bob) => bob.destroy());
        Object.values(this.structureViews).forEach((views) => views.forEach((view) => view.destroy()));
        Object.values(this.unitView).forEach((view) => view.destroy());
        this.infrastructureViews = {};
        this.structureViews = {};
        this.unitView = {};
    }

    private syncProjectionRender() {
        if (!this.mapContainer || !this.projectionAdapter) return;
        this.clearDynamicViews();
        this.renderDynamicLayers(this.mapContainer, this.projectionAdapter);
    }

    renderTerrainLayer(container: Phaser.GameObjects.Container, projectionAdapter: StrategicProjectionAdapterPort) {
        container.add(this.terrainBlitter);

        let scanLines = (projectionAdapter.height + projectionAdapter.width) - 1;
        var line = 0;
        while (line < scanLines) {
            for (let i = 0, j = line; i <= line; i++, j--) {
                if (i >= projectionAdapter.width) continue;
                if (j >= projectionAdapter.height) continue;

                let tileIndex = { x: i, y: j };
                let pos = this.screenCoordinates(i, j);
                this.terrainBlitter.create(pos.x, pos.y, projectionAdapter.terrainTileAt(tileIndex));
            }
            line++;
        }
    }

    renderDynamicLayers(container: Phaser.GameObjects.Container, projectionAdapter: StrategicProjectionAdapterPort) {
        container.add(this.infrastructureBlitter);

        let scanLines = (projectionAdapter.height + projectionAdapter.width) - 1;
        var line = 0;
        while (line < scanLines) {
            for (let i = 0, j = line; i <= line; i++, j--) {
                if (i >= projectionAdapter.width) continue;
                if (j >= projectionAdapter.height) continue;

                let tileIndex = { x: i, y: j };
                let pos = this.screenCoordinates(i, j);

                // render roads and walls
                const roadFrame = projectionAdapter.roadAt(tileIndex);
                if (roadFrame !== undefined) {
                    let obj = this.infrastructureBlitter.create(pos.x, pos.y, roadFrame);
                    this.infrastructureViews[`road-${i}-${j}`] = obj;
                }
                const wallFrame = projectionAdapter.wallAt(tileIndex);
                if (wallFrame !== undefined) {
                    let obj = this.infrastructureBlitter.create(pos.x, pos.y, wallFrame);
                    this.infrastructureViews[`wall-${i}-${j}`] = obj;
                }

                // render structures
                let structure = projectionAdapter.structureAt(tileIndex);
                if (structure) {
                    this.renderStructure(structure, pos);
                }

                // render units
                let unit = projectionAdapter.unitAt(tileIndex);
                if (unit) {
                    const unitImage = this.renderUnit(unit, pos);
                    container.add(unitImage);
                }
            }
            line++;
        }
    }

    renderUnit(unit: UnitEntityState, pos: { x: number, y: number }) {
        const unitImage = this.add.image(pos.x, pos.y, unit.spritesheet, unit.offset + unit.facing)
            .setOrigin(0, 0);

        // if we don't own this unit then don't allow us to select it
        if (unit.owner === this.currentGame.player.owner) {
            // unitImage.setInteractive({ cursor: 'url(' + customPointer + '), pointer' });
            unitImage.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                if (this.constructionMode) return;

                event.stopPropagation();
                this.onUnitSelected(unit, pos);
            });
        }

        this.unitView[unit.id] = unitImage;
        return unitImage;
    }

    renderStructure(structure: StructureEntityState, position: { x: number, y: number }) {
        const structureImage = this.add.image(position.x, position.y, structure.spritesheet, structure.offset)
            .setOrigin(0, 0)
            .setAlpha(structure.state === 'UNDER_CONSTRUCTION' ? 0.5 : 1.0);
        this.mapContainer.add(structureImage);

        let views = this.structureViews[structure.id] || [];
        views.push(structureImage)
        this.structureViews[structure.id] = views;

        if (structure.owner === this.currentGame.player.owner) {
            // structureImage.setInteractive({ cursor: 'url(' + structurePointer + '), pointer', pixelPerfect: true });
            structureImage.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                if (this.constructionMode) return;
                event.stopPropagation();
                this.onStructureSelected(structure);
            });
        }
    }

    centerCameraAtPoint(tileIndex: { x: number, y: number }) {
        let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);
        this.cameras.main.centerOn(pos.x, pos.y);
    }

    updateCurrentConstructionGraphics(tileIndex?: { x: number, y: number }) {

        if (!(this.constructionMode || this.currentlySelectedUnit) || !tileIndex || (this.constructionMode && this.constructionMode.kind === 'pending-construction')) {
            // hide all tile selectors
            Object.values(this.cachedTileSelectors).forEach(graphics => { graphics.visible = false });
            return;
        }

        let pos = this.screenCoordinates(tileIndex.x, tileIndex.y);

        // show the white square (and potentially add a cross through it when disabled) for:
        // - Taking a unit out of a structure
        // - Building a structure
        // - Moving a unit
        let enabledSelector
        let size = { x: 1, y: 1 };
        if (this.constructionMode) {
            size = { x: this.constructionMode.w, y: this.constructionMode.h };
            if (this.constructionMode.kind === 'pending-unit-exit') {
                const unitModel = this.constructionMode.model as ConstructionModelUnit;
                enabledSelector = this.projectionAdapter?.unitCanDisembark(unitModel.unitReference, unitModel.container, tileIndex);
            } else if (this.constructionMode.category) {
                enabledSelector = this.projectionAdapter?.validForConstruction(tileIndex, size, this.constructionMode.category);
            }
        } else if (this.currentlySelectedUnit) {
            // Assume all units are 1x1
            enabledSelector = this.projectionAdapter?.unitCanOccupy(this.currentlySelectedUnit.movement, tileIndex);
        }

        let graphics = this.loadTileSelector(enabledSelector || true, size);
        graphics.setPosition(pos.x, pos.y);

        // Only show the current tile selector graphic
        Object.values(this.cachedTileSelectors).forEach(g => { g.visible = (graphics === g) });
    }

    constructionCommand(mode: ConstructionMode, tileIndex: { x: number, y: number }): StrategicCommand | null {
        switch (mode.kind) {
            case 'road':
                return buildConstructionCommand(this.province, 'ROAD', tileIndex);
            case 'structure':
                if (!mode.category) return null;
                return buildConstructionCommand(this.province, mode.category, tileIndex);
            case 'recycle':
                // units and structures sit above everything else
                // so first try and remove those
                let topMost: { id: unknown; type: 'unit' | 'structure' | 'wall' | 'road' } | null =
                    (this.projectionAdapter?.unitAt(tileIndex) || this.projectionAdapter?.structureAt(tileIndex) || null) as
                    ({ id: unknown; type: 'unit' | 'structure' } | null);

                // if we didn't get one of those, fall back to a road
                // or wall
                if (!topMost) {
                    // check for wall or road
                    if (this.projectionAdapter?.wallAt(tileIndex)) {
                        topMost = { id: tileIndex, type: 'wall' }
                    } else if (this.projectionAdapter?.roadAt(tileIndex)) {
                        topMost = { id: tileIndex, type: 'road' }
                    }
                }

                // still nothing? then we probably just selected
                // and empty square so just ignore it and don't 
                // generate a command
                if (!topMost) return null;

                return {
                    type: 'STRATEGIC_DEMOLISH',
                    provinceId: String(this.province),
                    targetId: String(topMost.id),
                    targetType: topMost.type,
                    at: tileIndex,
                };
        }

        return null;
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId + '/' + this.province);

        let province = this.currentGame.provinces[this.province];
        let reference = provinceForKey(this.province);
        if (!reference) {
            console.error(`❌ ProvinceStrategic: Missing province lookup for '${String(this.province)}'`);
            this.add.text(320, 240, `ERROR: Missing province data\n${String(this.province)}`, {
                fontSize: '18px',
                color: '#ff0000',
                align: 'center'
            }).setOrigin(0.5, 0.5);
            return;
        }

        this.unitView = {} as Record<UnitIdentifier, Phaser.GameObjects.Image>;
        this.structureViews = {} as Record<StructureIdentifier, Phaser.GameObjects.Image[]>;
        this.infrastructureViews = {} as Record<string, Phaser.GameObjects.Bob>;
        this.cachedTileSelectors = {} as Record<string, Phaser.GameObjects.Graphics>;

        this.projectionAdapter?.initialise(province, UnitData, StructureData, reference);

        this.mapContainer = this.add.container(0, 0).setInteractive({
            hitArea: new Phaser.Geom.Polygon([
                35, 18,
                36, 18,
                35 + (35 * reference.width()), 18 + (18 * reference.width()),
                35 + (35 * reference.width()) - (35 * reference.height()), 19 + (18 * reference.width()) + (18 * reference.height()),
                35 - (35 * reference.height()), 19 + (18 * reference.height()),
                35 - (35 * reference.height()), 18 + (18 * reference.height())
            ]),
            hitAreaCallback: Phaser.Geom.Polygon.Contains,
            useHandCursor: true,
            draggable: true
        });

        this.add.existing(this.mapContainer);

        this.terrainBlitter = this.add.blitter(0, 0, TERRAIN_TEXTURE_KEYS[reference.type()]);
        this.infrastructureBlitter = this.add.blitter(0, 0, 'structure-infra');
        if (!this.projectionAdapter) {
            throw new Error('Strategic projection adapter not initialised');
        }
        this.renderTerrainLayer(this.mapContainer, this.projectionAdapter);
        this.renderDynamicLayers(this.mapContainer, this.projectionAdapter);

        // Render active unit selection
        this.activeUnitSelection = this.add.image(0, 0, 'active-unit-selection')
            .setOrigin(0.2, 0)
            .setVisible(false)
            .setDepth(2);

        this.uiCamera = this.cameras.add(0, 0, 640, 480)
            .setOrigin(0, 0);

        let dragStart = { x: 0, y: 0 };
        let dragPointerStart = { x: 0, y: 0 };
        const mainCamera = this.cameras.main;
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer) => {
            dragStart = { x: mainCamera.scrollX, y: mainCamera.scrollY };
            dragPointerStart = { x: pointer.x, y: pointer.y };
        });

        this.input.on('drag', (pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject, _dragX: number, _dragY: number) => {
            const dx = pointer.x - dragPointerStart.x;
            const dy = pointer.y - dragPointerStart.y;
            mainCamera.scrollX = dragStart.x - (dx / mainCamera.zoom);
            mainCamera.scrollY = dragStart.y - (dy / mainCamera.zoom);
        });

        let downStart = { x: 0, y: 0 };
        this.input.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            if (this.modalDialog) return;
            downStart = { x: Math.round(mainCamera.scrollX), y: Math.round(mainCamera.scrollY) };
        }, this);

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer, _localX: number, _localY: number, _event: unknown) => {
            let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);
            this.updateCurrentConstructionGraphics(tileIndex);
        }, this);

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (!this.pointerUpNearPointerDown(downStart)) return;

            let tileIndex = this.tileIndexFromCoordinates(pointer.worldX, pointer.worldY);

            if (this.constructionMode) {
                if (this.constructionMode.kind === 'pending-unit-exit') {
                    const { unitId, container, unitReference } = this.constructionMode.model as ConstructionModelUnit;
                    if (this.projectionAdapter?.unitCanDisembark(unitReference, container, tileIndex)) {
                        this.onUnitDisembarked({ id: unitId, type: 'unit' }, { id: container.id, type: container.type }, tileIndex);
                    }
                } else if (this.constructionMode.category) {
                    let size = { x: this.constructionMode.w, y: this.constructionMode.h };

                    let validForConstruction = this.projectionAdapter?.validForConstruction(tileIndex, size, this.constructionMode.category);
                    let command = validForConstruction ? this.constructionCommand(this.constructionMode, tileIndex) : null;
                    this.dispatchStrategic({
                        type: 'CONSTRUCTION_REQUEST',
                        command,
                        canConstruct: Boolean(validForConstruction),
                    });
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
                if (this.projectionAdapter?.unitCanOccupy(this.currentlySelectedUnit.movement, tileIndex)) {
                    this.onUnitMoved(this.currentlySelectedUnit, tileIndex);
                }
            }
        }, this);

        // Static UI in a container
        let ui = this.add.container(0, 0).setDepth(2);

        this.overviewProvince = new ProvinceOverview(this, 32, 34, this.currentGame, ui).setVisible(false);
        ui.add(this.overviewProvince);
        this.buttonRepair = createButton(this, 12, 410, strategic.repair, (button) => {
            const dialog = new MessageBox(this, 160, 150, "Repair?", () => {
                dialog.destroy();
            }, () => {
                dialog.destroy();
            })
            this.add.existing(dialog);
            dialog.show();
        })
        ui.add(this.buttonRepair);
        this.buttonBuild = createButton(this, 52, 410, strategic.build, (button) => {
            const mode = this.constructionMode && this.constructionMode.kind === 'pending-construction'
                ? null
                : { w: 1, h: 1, kind: 'pending-construction' as const };
            this.dispatchStrategic({
                type: 'SET_CONSTRUCTION_MODE',
                mode,
            });
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonBuild);
        this.buttonRoad = createButton(this, 113, 410, strategic.road, (button) => {
            const mode = this.constructionMode && this.constructionMode.kind === 'road'
                ? null
                : { w: 1, h: 1, kind: 'road' as const, category: 'ROAD' as const };
            this.dispatchStrategic({
                type: 'SET_CONSTRUCTION_MODE',
                mode,
            });
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonRoad);
        this.buttonRecycle = createButton(this, 161, 410, strategic.recycle, (button) => {
            const mode = this.constructionMode && this.constructionMode.kind === 'recycle'
                ? null
                : { w: 1, h: 1, kind: 'recycle' as const, category: 'RECYCLE' as const };
            this.dispatchStrategic({
                type: 'SET_CONSTRUCTION_MODE',
                mode,
            });
            this.onConstructionModeUpdated();
        })
        ui.add(this.buttonRecycle);
        this.buttonMap = createButton(this, 424, 410, strategic.map, (button) => { this.onOverviewToggled() });
        ui.add(this.buttonMap);
        this.buttonMenu = createButton(this, 486, 410, strategic.menu, (button) => {
            this.onDeselected();
            this.scene.start('MainMenu');
        });
        ui.add(this.buttonMenu);
        this.buttonColony = createButton(this, 563, 410, strategic.colony, (button) => {
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
            .on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                event.stopPropagation();
                this.onDeselected();
            });
        ui.add(infoTextZone);
        this.uiContainer = ui;
        this.add.existing(ui);

        this.cameras.main.ignore(ui);
        this.uiCamera.ignore(this.mapContainer);

        const keyboard = this.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input is unavailable');
        }
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            zoomIn: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            speed: 0.7
        });

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        ui.add(this.add.text(58, 6, String(calculateIncome(province, 'RESEARCH')), font).setOrigin(0.5, 0));
        ui.add(this.add.text(133, 6, String(calculateIncome(province, 'ENERGY')), font).setOrigin(0.5, 0));
        ui.add(this.add.text(320, 6, reference.name() ?? '', font).setOrigin(0.5, 0));
        ui.add(this.add.text(569, 6, this.currentGame.player.globalReserve + "/" + calculateIncome(province, 'CREDITS'), font).setOrigin(0.5, 0));

        this.centerCameraAtPoint({ x: reference.width() / 2, y: reference.height() / 2 });
    }

    update(_time: number, delta: number) {
        this.controls.update(delta);
    }
}
