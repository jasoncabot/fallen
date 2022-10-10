import Phaser from 'phaser';
import { GameObjects } from 'phaser';

import { confirmCancel, createButton, registerButtons } from '../assets/Buttons';

import mainMenuBackground from '../images/ui/messagebox.png';

export default class MessageBox extends GameObjects.Container {
    message: string;
    onConfirm: (button: GameObjects.Image) => void;
    onCancel: (button: GameObjects.Image) => void;

    static preload(scene: Phaser.Scene) {
        scene.load.image('messagebox-background', mainMenuBackground);
        registerButtons(scene, confirmCancel);
    }

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onConfirm: (button: GameObjects.Image) => void, onCancel: (button: GameObjects.Image) => void) {
        super(scene, x, y);

        this.message = text;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
    }

    show() {
        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };

        const background = this.scene.add.image(0, 0, 'messagebox-background').setOrigin(0);
        const text = this.scene.add.text(14, 11, this.message, font);
        const confirm = createButton(this.scene, 25, 137, confirmCancel.confirm, (button) => {
            this.onConfirm(button);
        });
        const cancel = createButton(this.scene, 215, 137, confirmCancel.cancel, (button) => {
            this.onCancel(button);
        });

        this.add(background);
        this.add(text);
        this.add(confirm);
        this.add(cancel);
    }
}
