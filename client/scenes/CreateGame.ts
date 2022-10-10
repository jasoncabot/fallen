import { PlayerGameProjection } from '../../shared/index';
import { Game, Scene } from 'phaser';
import createGameBackground from '../images/ui/creategame-background.png';

import * as api from '../models/API';
import { Person, person, setPerson } from '../models/Authenticator';
import { GameOptions } from '../models/GameOptions';
import { registerScenePath } from './History';
import { MenuButton } from './MenuButton';

export interface StartGameRequest {
    name: string
    race: number
    difficulty: number
    campaign: number
}

export default class CreateGame extends Scene {
    options!: GameOptions;
    person!: Person;

    constructor() {
        super({
            key: 'CreateGame'
        });
    }

    init(data: { options: GameOptions; }) {
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

        let inputName = `<input type="text" name="name" value="${this.person.name}" placeholder="Enter your name" style="font-size: 14px; width: 237px; height: 35px; position: absolute; top: 233px; left: 131px; padding-left: 8px;">`;

        let element = this.add.dom(0, 0).createFromHTML(inputName);

        this.add.existing(new MenuButton(this, { x: 386, y: 231, width: 126, height: 38 }, 'Start', (scene) => {
            let name = (element.getChildByName('name') as HTMLInputElement).value;
            this.options.name = name;
            this.person.name = name;
            setPerson(this.person);
            this.onStart(this.options);
        }));
    }

    async onStart(options: GameOptions) {
        try {
            console.log('📤 CreateGame: Creating new game with options:', options);
            const game = await api.post('/games', {
                name: options.name,
                race: options.race,
                difficulty: options.difficulty,
                campaign: options.campaign
            } as StartGameRequest) as PlayerGameProjection;

            console.log('✓ CreateGame: Game created:', game.id);
            this.scene.start('LoadGameResources', { 
                gameId: game.id,
                province: undefined,
                view: 'overview'
            });
        } catch (e) {
            console.error('❌ CreateGame: Failed to create game:', e);
        }
    }
}
