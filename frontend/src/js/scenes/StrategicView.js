import { Scene } from 'phaser';

import { api } from '../Config';
import { registerButtons, createButton, buttons } from '../assets/Buttons';

import strategicMap from '../../images/ui/strategic-map.png';

export default class StrategicView extends Scene {
    constructor() {
        super({
            key: 'StrategicView'
        });
    }

    init(data) {
        this.gameId = data.gameId;
    }

    preload() {
        this.load.image('strategic-map', strategicMap);

        registerButtons(this, buttons.world);

        // dynamic content
        this.load.json('game', api("/games/" + this.gameId));
    }

    create() {
        this.add.image(0, 0, 'strategic-map')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        createButton(this, 246, 401, buttons.world.menu, (button) => { alert('menu'); })
        createButton(this, 349, 399, buttons.world.technology, (button) => { alert('tech'); })
        createButton(this, 533, 365, buttons.world.map, (button) => { alert('map'); })
        createButton(this, 411, 400, buttons.world.zoom, (button) => { alert('zoom'); })
        createButton(this, 532, 433, buttons.world.endTurn, (button) => { alert('end'); })
    }
}
