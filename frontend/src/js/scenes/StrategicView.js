import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';
import MessageBox from '../components/MessageBox';

import strategicMap from '../../images/ui/strategic-map.png';
import { registerScenePath } from './../components/History';

export default class StrategicView extends Scene {
    constructor() {
        super({
            key: 'StrategicView'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.view = data.view;
    }

    preload() {
        this.load.image('strategic-map', strategicMap);

        registerButtons(this, buttons.world);
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId);

        const game = this.cache.json.get('current-game');
        this.selectedColony = 'haven'; // TODO: select this based on province selected

        // TODO: add the map

        this.add.image(0, 0, 'strategic-map')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        createButton(this, 246, 401, buttons.world.menu, (button) => { alert('menu'); })
        createButton(this, 349, 399, buttons.world.technology, (button) => { alert('tech'); })
        createButton(this, 533, 365, buttons.world.map, (button) => {
            this.scene.start('Play', {
                gameId: this.gameId,
                colony: this.selectedColony,
                view: this.view
            });
        })
        createButton(this, 411, 400, buttons.world.zoom, (button) => { alert('zoom'); })
        createButton(this, 532, 433, buttons.world.endTurn, (button) => {

            const key = 'end-turn-key';
            let box = new MessageBox(key, 160, 150, this, 'End Strategic Turn?');
            box.confirm = () => {
                alert('ending turn');
                this.scene.remove(key);
            }
            box.cancel = () => {
                this.scene.remove(key);
            }
            this.scene.add(key, box, true);
        })
    }
}
