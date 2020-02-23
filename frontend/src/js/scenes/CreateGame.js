import { Scene } from 'phaser';

import * as api from '../models/API';

import { MenuButton } from '../components/MenuButton';

import creategameBackground from '../../images/ui/creategame-background.png';
import { registerScenePath } from './../components/History';

export default class CreateGame extends Scene {
    constructor() {
        super({
            key: 'CreateGame'
        });
    }

    init(data) {
        this.options = data.options;
        this.auth = api.auth;
    }

    preload() {
        this.load.image('creategame-background', creategameBackground);
    }

    create() {
        registerScenePath(this, '/games/new');
        this.add.image(320, 240, 'creategame-background');

        this.add.text(130, 213, 'Your name', { color: 'white', fontSize: '14px', fontFamily: 'Verdana' });

        let inputName = `<input type="text" name="name" value="${this.auth.name}" placeholder="Enter your name" style="font-size: 14px; width: 225px; height: 30px; position: absolute; top: 233px; left: 131px; padding-left: 8px;">`;
        let element = this.add.dom().createFromHTML(inputName);

        this.add.existing(new MenuButton(this, { x: 386, y: 231, width: 126, height: 38 }, 'Start', (scene) => {
            let name = element.getChildByName('name').value;
            this.options['name'] = name;
            this.auth.updateName(name);
            this.onStart(this.options);
        }));
    }

    onStart(options) {
        const data = {
            name: options.name,
            race: options.race,
            difficulty: options.difficulty,
            campaign: options.campaign
        };
        api.post('/games', data)
            .then(game => {
                this.scene.start('LoadGameResources', { gameId: game.id });
            })
            .catch(e => {
                alert(e);
            });
    }
}