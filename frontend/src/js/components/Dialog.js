import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';

import dialogBuild from '../../images/ui/dialog-build.png';
import dialogStructure from '../../images/ui/dialog-structure.png';

export default class Dialog extends Scene {

    constructor(key, x, y, parent) {
        super(key);

        this.zone = parent.add.zone(x, y, 384, 268).setOrigin(0);
    }

    preload() {
        this.load.image('dialog-build', dialogBuild);
        this.load.image('dialog-structure', dialogStructure);

        registerButtons(this, buttons.manufacturing);
    }

    create() {
        this.cameras.main.setViewport(this.zone.x, this.zone.y, this.zone.width, this.zone.height);

        this.add.image(0, 0, 'dialog-build').setOrigin(0, 0).setScrollFactor(0);

        createButton(this, 216, 238, buttons.manufacturing.up, (button) => { });
        createButton(this, 256, 238, buttons.manufacturing.down, (button) => { });
    }

    dismiss() {
        this.scene.sleep();
    }
}
