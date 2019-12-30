import Phaser, { Game } from 'phaser';

import './styles/index.scss';

import { App } from './js/App';

const config = {
    type: Phaser.AUTO,
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'root',
        width: 640,
        height: 480
    }
};

let game = new Game(config);

let app = new App();

app.registerScenes(game);
