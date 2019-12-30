import { Scene } from 'phaser';

import dialogBuild from '../../images/ui/dialog-build.png';
import dialogStructure from '../../images/ui/dialog-structure.png';
import buttonsManufacturing from '../../images/buttons/manufacturing.png';
import buttonsManufacturingData from '../../images/buttons/manufacturing.json';

export class Dialog extends Scene {

    constructor(key, x, y, parent) {
        super(key);

        this.zone = parent.add.zone(x, y, 384, 268).setOrigin(0);
    }

    preload() {
        this.load.image('dialog-build', dialogBuild);
        this.load.image('dialog-structure', dialogStructure);
        this.load.atlas('buttons-manufacturing', buttonsManufacturing, buttonsManufacturingData);
    }

    create() {
        this.cameras.main.setViewport(this.zone.x, this.zone.y, this.zone.width, this.zone.height);

        this.add.image(0, 0, 'dialog-build').setOrigin(0, 0).setScrollFactor(0);

        this.createButton('up', 216, 238, () => {});
        this.createButton('down', 256, 238, () => {});
    }

    dismiss() {
        this.scene.sleep();
    }

    createButton(name, x, y, callback) {
        let button = this.add.image(x, y, 'buttons-manufacturing', name + '_0')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        button.on('pointerover', () => { button.setFrame(name + '_1'); });
        button.on('pointerout', () => { button.setFrame(name + '_0'); });
        button.on('pointerdown', () => { button.setFrame(name + '_2'); });
        button.on('pointerup', () => {
            button.setFrame(name + '_0');
            callback();
        });
    }

}
