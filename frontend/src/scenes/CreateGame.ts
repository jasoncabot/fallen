import { Scene } from 'phaser';
import createGameBackground from '../images/ui/creategame-background.png';

import * as api from '../models/API';
import { Person, person, setPerson } from '../models/Authenticator';
import { registerScenePath } from './History';
import { MenuButton } from './MenuButton';

export default class CreateGame extends Scene {
    options: any;
    person!: Person;

    constructor() {
        super({
            key: 'CreateGame'
        });
    }

    init(data: { options: any; }) {
        this.options = data.options;
        this.person = person();
    }

    preload() {
        this.load.image('creategame-background', createGameBackground);
    }

    create() {
        registerScenePath(this, '/games/new');
        this.add.image(320, 240, 'creategame-background');

        this.add.text(130, 213, 'Your name', { color: 'white', fontSize: '14px', fontFamily: 'Verdana' });

        let inputName = `<input type="text" name="name" value="${this.person.name}" placeholder="Enter your name" style="font-size: 14px; width: 222px; height: 27px; position: absolute; top: 233px; left: 131px; padding-left: 8px;">`;

        let element = this.add.dom(0, 0).createFromHTML(inputName);

        this.add.existing(new MenuButton(this, { x: 386, y: 231, width: 126, height: 38 }, 'Start', (scene) => {
            let name = (element.getChildByName('name') as HTMLInputElement).value;
            this.options['name'] = name;
            this.person.name = name;
            setPerson(this.person);
            this.onStart(this.options);
        }));
    }

    onStart(options: { name: string, race: string, difficulty: string, campaign: string }) {
        const data = {
            name: options.name,
            race: options.race,
            difficulty: options.difficulty,
            campaign: options.campaign
        };
        api.post('/games', data)
            .then((game: any) => {
                this.scene.start('LoadGameResources', { gameId: game.id });
            })
            .catch(e => {
                console.warn(e);
            });
    }
}
