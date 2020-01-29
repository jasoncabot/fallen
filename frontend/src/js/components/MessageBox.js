import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';

import background from '../../images/ui/messagebox.png';

export default class MessageBox extends Scene {

    constructor(key, x, y, parent, string) {
        super(key);

        this.message = string;
        this.zone = parent.add.zone(x, y, 320, 180).setOrigin(0);
    }

    preload() {
        this.load.image('messagebox', background);
        registerButtons(this, buttons.confirmCancel);
    }

    create() {
        this.cameras.main.setViewport(this.zone.x, this.zone.y, this.zone.width, this.zone.height);

        this.add.image(0, 0, 'messagebox').setOrigin(0, 0).setScrollFactor(0);

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Courier' };
        this.add.text(14, 11, this.message, font);

        createButton(this, 25, 137, buttons.confirmCancel.confirm, (button) => {
            this.confirm();
        });
        createButton(this, 215, 137, buttons.confirmCancel.cancel, (button) => {
            this.cancel();
        });
    }
}
