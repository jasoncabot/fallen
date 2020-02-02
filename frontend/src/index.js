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
    },
    dom: {
        createContainer: true
    }
};

let game = new Game(config);

let app = new App(game);

const showSceneMatchingCurrentLocation = () => {
    app.route(location.pathname, location.search);
}

app.registerScenes(game);

// using the browser to navigate performs the appropriate routing
window.addEventListener('popstate', e => showSceneMatchingCurrentLocation(), false);
window.addEventListener('pushstate', e => showSceneMatchingCurrentLocation(), false);

// by default go to the scene for whatever the current pathname is
showSceneMatchingCurrentLocation();