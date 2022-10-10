import Phaser from 'phaser';
import { Displayable, ProvinceState, StructureActionKind, StructureCategory, StructureData, StructureEntityState, StructureTiles, StructureType, StructureValue, Technology, TurnMode, UnitData, UnitIdentifier, UnitEntityState, UnitValue, Vec2 } from '../../shared/index';
import { createButton, CustomButton, manufacturing, registerButtons } from "../assets/Buttons";

import dialogStructure from "../images/ui/dialog-structure.png";


const showUnitInformation: (s: StructureEntityState, r: StructureValue) => boolean = (structure: StructureEntityState, reference: StructureValue) => {
    if (structure.state === 'UNDER_CONSTRUCTION') return false;
    const containsUnits = structure.units.current && Object.keys(structure.units.current).length > 0;
    const canBuildUnits = ['TROOP', 'FACTORY', 'HOVER'].indexOf(reference.production.category) >= 0;
    const canCarryUnits = ['DROPSHIP'].indexOf(reference.kind.type) >= 0;
    const showUnitInformation = containsUnits || canBuildUnits || canCarryUnits;
    return showUnitInformation;
}

export interface StructureDialogContext {
    container: StructureEntityState
    // position?: Vec2
    unit?: UnitEntityState
    unitReference?: UnitValue
}

export default class StructureDialog extends Phaser.GameObjects.Container {
    province: ProvinceState;
    technology: Technology;
    structure: StructureEntityState;
    mode: string;
    structureReference: StructureValue;
    onActionSelected: (kind: StructureActionKind, context: StructureDialogContext) => void;
    storedCommand: StructureActionKind | null
    showUnits: boolean;
    unitOffset: number;
    unitKeys: UnitIdentifier[];
    currentStructureImages: Phaser.GameObjects.Image[];
    currentUnitImages: Phaser.GameObjects.Image[];
    buttonUp?: CustomButton;
    buttonDown?: CustomButton;
    healthBar?: Phaser.GameObjects.Rectangle;
    nameLabel?: Phaser.GameObjects.Text;
    lines?: Phaser.GameObjects.Text[];

    static preload(scene: Phaser.Scene) {
        registerButtons(scene, manufacturing);
        scene.load.image('dialog-structure', dialogStructure);
    }

    constructor(scene: Phaser.Scene, x: number, y: number, province: ProvinceState, technology: Technology, structure: StructureEntityState, mode: TurnMode, onDismiss: (structure: StructureEntityState) => void, onActionSelected: (kind: StructureActionKind, context: StructureDialogContext) => void) {
        super(scene, x, y);

        const structureRef = StructureData[structure.category];

        this.province = province;
        this.technology = technology;
        this.structure = structure;
        this.mode = mode;
        this.structureReference = structureRef;
        this.onActionSelected = onActionSelected;

        const showUnits = showUnitInformation(structure, structureRef);
        const width = showUnits ? 600 : 288;
        this.setSize(width, 254);
        this.add(scene.add.zone(0, 0, 288, 254)
            .setOrigin(0)
            .setInteractive()
            .on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                event.stopPropagation();
                onDismiss(structure);
            })
        );

        if (structureRef.action[mode] && structure.state !== 'UNDER_CONSTRUCTION') {
            this.storedCommand = structureRef.action[mode];
        } else {
            this.storedCommand = null;
        }

        this.showUnits = showUnits;
        this.unitOffset = 0;
        this.unitKeys = Object.keys(structure.units.current);
        this.currentStructureImages = [];
        this.currentUnitImages = [];
    }

    show() {
        this.setVisible(true);
        this.add(this.scene.add.image(0, 0, 'dialog-structure')
            .setOrigin(0)
            .setCrop(0, 0, this.width, this.height)
        );

        // Unit Production
        if (this.showUnits) {
            this.buttonUp = createButton(this.scene, 401, 228, manufacturing.up, (_button) => {
                this.unitOffset = Math.max(0, this.unitOffset - 4)
                this.onUnitPageChanged();
            });
            this.add(this.buttonUp);
            this.buttonDown = createButton(this.scene, 442, 228, manufacturing.down, (_button) => {
                this.unitOffset = Math.min(this.structure.units.max, this.unitOffset + 4)
                this.onUnitPageChanged();
            });
            this.add(this.buttonDown);
            this.onUnitPageChanged();
        }

        // Main Action
        if (this.storedCommand) {
            const actionButton = createButton(this.scene, 174, 208, manufacturing.ok, (_button) => {
                if (!this.storedCommand) return;
                this.onActionSelected(this.storedCommand, { container: this.structure });
            });
            this.add(actionButton);
        }

        // Health
        this.healthBar = this.scene.add.rectangle(12, 228, (this.structure.hp.current / this.structure.hp.max) * 141, 19, 0x286817)
            .setOrigin(0);
        this.add(this.healthBar);

        this.drawStructure(this.structureReference.display);

        const small = 2;
        const medium = 50;
        const ox = 16;
        var oy = 11;
        this.nameLabel = this.scene.add.text(ox, oy, this.structureReference.kind.name, { color: 'green', fontSize: '14px', fontFamily: 'Verdana' });
        this.add(this.nameLabel);

        let lines = this.linesForStructure(this.province, this.structure, this.structureReference);
        this.lines = lines.map((text, index) => {
            const line = this.scene.add.text(ox, oy + ((index + 1) * (12 + small)), text, { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
            this.add(line);
            return line;
        });

        return this;
    }

    hide() {
        this.setVisible(false);
        this.destroy();
    }

    drawStructure(structure: Displayable<StructureTiles>) {
        if (!structure.width || !structure.height) {
            console.warn(`Attempting to drawStructure('${structure.tiles}') without width or height`);
            return;
        }

        this.currentStructureImages.forEach(img => { img.destroy() });
        let offset = structure.offset;
        const start = { x: 120, y: 80 };
        for (let x = 0; x < structure.width; x++) {
            for (let y = 0; y < structure.height; y++) {
                let img = this.scene.add.image(
                    start.x + ((x - y) * 35),
                    start.y + (((x + y) / 2) * 36),
                    structure.tiles,
                    offset++)
                    .setOrigin(0);
                this.currentStructureImages.push(img);
                this.add(img);
            }
        }
    }

    drawUnit(unitId: UnitIdentifier, unit: UnitEntityState, offset: number) {
        const pos = {
            x: 304 + (offset * 70),
            y: 145
        };
        const reference = UnitData[unit.kind.category];
        const unitImage = this.scene.add.image(pos.x, pos.y,
            reference.display.tiles, reference.display.offset + unit.facing)
            .setOrigin(0)
        // .setInteractive({ cursor: 'url(' + customPointer + '), pointer' });
        this.add(unitImage);
        this.currentUnitImages.push(unitImage);

        unitImage.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
            event.stopPropagation();
            this.onUnitSelected(unitId);
        });
    }

    linesForStructure(province: ProvinceState, structure: StructureEntityState, reference: StructureValue) {
        const lines = [];

        const structureIs = (array: StructureType[]) => {
            return array.indexOf(reference.kind.type) >= 0;
        }

        // Energy Consumption
        const energyConsumption = (reference.energyUsage && reference.energyUsage > 0) ? `${reference.energyUsage} EP per turn` : 'Nil'
        lines.push(`Energy consumption: ${energyConsumption}`);

        // Unit production
        if (structureIs(['AIRPORT', 'BARRACKS', 'DROPSHIP', 'FACTORY'])) {
            // Storage space ...
            // Units inside ...
            lines.push(`Storage space: ${structure.units.max}`);
            lines.push(`Units inside: ${Object.keys(structure.units.current).length}`);
            // Resource production
        } else if (structureIs(['ENERGY', 'LAB', 'MINING'])) {
            // ... in province ...
            // Each produces ...
            // Total production ...
            const total = Object.values(province.structures!).filter(s => s.kind.category === reference.kind.category).length;
            lines.push(`${reference.kind.name} on province: ${total}`);
            const productionUnits = {
                'ENERGY': 'EP',
                'CREDITS': 'Credits',
                'RESEARCH': 'RP',
                'DROPSHIP': undefined,
                'FACTORY': undefined,
                'HOVER': undefined,
                'NONE': undefined,
                'TROOP': undefined,
            }[reference.production.category];
            if (productionUnits) {
                lines.push(`Each produces ${reference.production.value} ${productionUnits}`);
                lines.push(`Total production ${reference.production.value * total} ${productionUnits}`);
            }
        }

        // Special Structures
        switch (reference.kind.type) {
            case 'ANTIMISSILE':
                lines.push(`Protects against missile strike`);
                break;
            case 'MISSILE':
                lines.push(`Missile cost: ${1000} Credits`);
                lines.push(`Allows construction of Missiles`);
                break;
            case 'SCANNER':
                lines.push(`Allows scanning of adjacent provinces`);
                break;
            case 'STARPORT':
                lines.push(`Allows Construction of Dropships`);
                lines.push(`Dropship cost ${600} Credits`);
                break;
            case 'TOWER':
                lines.push(`Weapon damage ${60}`);
                break;
        }

        if (structureIs(['ANTIMISSILE', 'MISSILE'])) {
            lines.push(`Efficiency level ${this.technology.rocketry}`);
        }

        return lines;
    }

    onUnitSelected(unitId: UnitIdentifier) {
        const unit = this.structure.units.current[unitId];
        const reference = UnitData[unit.kind.category];
        this.onActionSelected('EXIT_STRUCTURE', {
            container: this.structure,
            unit: unit,
            unitReference: reference
        });
    }

    onUnitPageChanged() {
        this.currentUnitImages.forEach(img => { img.destroy() });
        const unitsPerPage = 4;

        // enable/disable up/down buttons
        const visibleKeys = this.unitKeys.slice(this.unitOffset, this.unitOffset + unitsPerPage);

        visibleKeys.forEach((key, index) => {
            const unit = this.structure.units.current[key];
            this.drawUnit(key, unit, index);
        });

        if (this.buttonUp) {
            if (this.unitOffset === 0) {
                this.buttonUp.disable();
            } else {
                this.buttonUp.enable();
            }
        }

        if (this.buttonDown) {
            if (this.unitOffset + unitsPerPage >= this.structure.units.max) {
                this.buttonDown.disable();
            } else {
                this.buttonDown.enable();
            }
        }
    }
}
