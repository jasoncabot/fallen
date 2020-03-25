import { GameObjects } from 'phaser';

import { createButton, buttons } from '../assets/Buttons';

import { StructureData } from 'shared';

const showUnitInformation = (structure, reference) => {
    const containsUnits = structure.units && Object.keys(structure.units).length > 0;
    const canBuildUnits = ['TROOP', 'FACTORY', 'HOVER'].indexOf(reference.production.category) >= 0;
    const showUnitInformation = containsUnits || canBuildUnits;
    return showUnitInformation;
}

export default class StructureDialog extends GameObjects.Container {

    constructor(scene, x, y, province, technology, structure, mode, onDismiss, onActionSelected) {
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
        this.add(scene.add.zone(0, 0, width, 254)
            .setOrigin(0)
            .setInteractive()
            .on('pointerup', (_pointer, _x, _y, event) => {
                event.stopPropagation();
                onDismiss(structure);
            })
        );

        if (structureRef.action && structureRef.action[mode]) {
            this.storedCommand = structureRef.action[mode];
        }

        this.showUnits = showUnits;
        this.unitOffset = 0;
        this.currentImages = [];
    }

    show() {
        this.setVisible(true);
        this.add(this.scene.add.image(0, 0, 'dialog-structure')
            .setOrigin(0)
            .setCrop(0, 0, this.width, this.height)
        );

        // Unit Production
        if (this.showUnits) {
            this.add(createButton(this.scene, 401, 228, buttons.manufacturing.up, (button) => {
                console.log('moved up');
            }));
            this.add(createButton(this.scene, 442, 228, buttons.manufacturing.down, (button) => {
                console.log('moved down');
            }));

            // TODO: if there are units in here already, count how many, 
            // if more than 4, look at this.unitOffset (page) show down/up arrow

        }
        this.unitOffset = 0;

        // Main Action
        if (this.storedCommand) {
            const actionButton = createButton(this.scene, 174, 208, buttons.manufacturing.ok, (button) => {
                this.onActionSelected(this.storedCommand, this.structure);
            });
            this.add(actionButton);
        }

        // Health
        this.healthBar = this.scene.add.rectangle(12, 228, (this.structure.hp.current / this.structure.hp.max) * 141, 19, 0x286817)
            .setOrigin(0);
        this.add(this.healthBar);

        this.draw(this.structureReference.display);

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

    draw(structure) {
        this.currentImages.forEach(img => { img.destroy() });
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
                this.currentImages.push(img);
                this.add(img);
            }
        }
    }

    linesForStructure(province, structure, reference) {
        const lines = [];

        const structureIs = (array) => {
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
            const total = Object.values(province.structures).filter(s => s.kind.category === reference.kind.category).length;
            lines.push(`${reference.kind.name} on province: ${total}`);
            const productionUnits = {
                'ENERGY': 'EP',
                'CASH': 'Credits',
                'RESEARCH': 'RP'
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
}