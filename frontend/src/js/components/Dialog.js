import { GameObjects } from 'phaser';

import { createButton, buttons } from '../assets/Buttons';

import { StructureData } from 'shared';

export default class Dialog extends GameObjects.Container {

    constructor(scene, x, y, callback) {
        super(scene, x, y);

        this.onStructureSelected = callback;
        this.setSize(384, 268);
        this.setInteractive({ useHandCursor: true }).on('pointerdown', (_pointer, _x, _y, event) => {
            event.stopPropagation();
            this.onStructureSelected(this.currentStructure);
        });
        this.input.hitArea.x += 192;
        this.input.hitArea.y += 134;
        this.setScrollFactor(0);

        this.currentOffset = 0;
        this.structureKeys = Object.keys(StructureData).filter(key => !StructureData[key].kind.starship);
        this.currentImages = [];
    }

    show() {
        this.setVisible(true);
        this.add(this.scene.add.image(0, 0, 'dialog-build').setOrigin(0, 0).setScrollFactor(0));

        this.add(createButton(this.scene, 216, 238, buttons.manufacturing.up, (button) => {
            this.currentOffset -= 1;
            if (this.currentOffset < 0) this.currentOffset = this.structureKeys.length - 1;
            this.currentStructure = StructureData[this.structureKeys[this.currentOffset]];
            this.onCurrentStructureUpdated();
        }));
        this.add(createButton(this.scene, 256, 238, buttons.manufacturing.down, (button) => {
            this.currentOffset += 1;
            if (this.currentOffset >= this.structureKeys.length) this.currentOffset = 0;
            this.currentStructure = StructureData[this.structureKeys[this.currentOffset]];
            this.onCurrentStructureUpdated();
        }));

        const small = 2;
        const medium = 50;
        const ox = 10;
        var oy = 38;
        this.nameLabel = this.scene.add.text(ox, oy, "", { color: 'green', fontSize: '14px', fontFamily: 'Verdana' });
        this.add(this.nameLabel);
        this.uniqueFeatureLabel = this.scene.add.text(ox, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.add(this.uniqueFeatureLabel);
        this.energyConsumptionLabel = this.scene.add.text(ox, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.add(this.energyConsumptionLabel);
        this.armourLabel = this.scene.add.text(ox, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.add(this.armourLabel);
        this.costLabel = this.scene.add.text(ox, oy += (12 + small), "", { color: 'green', fontSize: '12px', fontFamily: 'Verdana' });
        this.add(this.costLabel);
        this.restrictionLabel = this.scene.add.text(ox, oy += (12 + medium), "", { color: 'red', fontSize: '12px', fontFamily: 'Verdana' });
        this.add(this.restrictionLabel);

        this.currentStructure = StructureData[this.structureKeys[this.currentOffset]];
        this.onCurrentStructureUpdated();

        return this;
    }

    hide() {
        this.setVisible(false);
        this.destroy();
    }

    onCurrentStructureUpdated() {

        this.draw(this.currentStructure.display);

        this.nameLabel.setText(this.currentStructure.kind.name);
        this.uniqueFeatureLabel.setText(this.currentStructure.encyclopedia.short);
        this.energyConsumptionLabel.setText(`Energy consumption: ${this.currentStructure.usage.energy} EP per turn`);
        this.armourLabel.setText(`Armour: ${this.currentStructure.hp}`);
        this.costLabel.setText(`Cost: ${this.currentStructure.usage.cash}`);
        this.restrictionLabel.setText('One per province');
    }


    draw(structure) {
        this.currentImages.forEach(img => { img.destroy() });
        let offset = structure.offset;
        const start = { x: 238, y: 90 };
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
}
