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

let app = new App(game);

app.registerScenes(game);

window.addEventListener('popstate', e => {
    app.route(location.pathname, location.search);
}, false);
app.route(location.pathname, location.search);