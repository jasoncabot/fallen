import { Scene } from 'phaser';

import { api } from '../Config';

import { MenuButton } from '../components/MenuButton';
import { Authenticator } from '../models/Authenticator';

import creategameBackground from '../../images/ui/creategame-background.png';
import { registerScenePath } from './../components/History';

export default class CreateGame extends Scene {
    constructor() {
        super({
            key: 'CreateGame'
        });
        this.auth = new Authenticator();
    }

    init(data) {
        this.options = data.options;
    }

    preload() {
        this.load.image('creategame-background', creategameBackground);
    }

    create() {
        registerScenePath(this, '/games');
        this.add.image(320, 240, 'creategame-background');

        this.add.text(130, 213, 'Name your colony', { color: 'white', fontSize: '14px', fontFamily: 'Verdana' });

        let inputName = `<input type="text" name="name" value="${this.auth.name}" placeholder="Enter your name" style="font-size: 14px; width: 225px; height: 30px; position: absolute; top: 233px; left: 131px; padding-left: 8px;">`;
        this.add.dom().createFromHTML(inputName);

        this.add.existing(new MenuButton(this, { x: 386, y: 231, width: 126, height: 38 }, 'Start', (scene) => {
            this.onStart(this.options);
        }));
    }

    onStart(options) {
        const { race, difficulty, campaign } = options;
        const headers = { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + btoa(this.auth.id)
        };
        const data = { race, difficulty, campaign };
        fetch(api('/games'), {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json();
        }).then(game => {
            this.scene.start('LoadGameResources', { gameId: game.id });
        }).catch(e => {
            alert(e);
        });
    }
}
