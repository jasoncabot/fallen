import { Scene } from 'phaser';

export default class InfoText extends Scene {

    constructor(key, title) {
        super(key);
        this.title = title;
    }

    create() {
        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        this.add.text(232, 413, this.title, font);
    }
}
