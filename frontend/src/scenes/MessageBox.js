import { GameObjects } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';

import { MessageBoxBackground } from '../images/ui';

export default class MessageBox extends GameObjects.Container {

    static preload(scene) {
        scene.load.image('messagebox-background', MessageBoxBackground);
        registerButtons(scene, buttons.confirmCancel);
    }

    constructor(scene, x, y, text, onConfirm, onCancel) {
        super(scene, x, y);

        this.message = text;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
    }

    show() {
        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };

        const background = this.scene.add.image(0, 0, 'messagebox-background').setOrigin(0);
        const text = this.scene.add.text(14, 11, this.message, font);
        const confirm = createButton(this.scene, 25, 137, buttons.confirmCancel.confirm, (button) => {
            this.onConfirm();
        });
        const cancel = createButton(this.scene, 215, 137, buttons.confirmCancel.cancel, (button) => {
            this.onCancel();
        });

        this.add(background);
        this.add(text);
        this.add(confirm);
        this.add(cancel);
    }
}
