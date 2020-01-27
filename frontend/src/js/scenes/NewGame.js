import { Scene } from 'phaser';

import { api } from '../Config';

import { MenuButton } from '../components/MenuButton';
import { GameOptions } from '../models/GameOptions';

import newgameBackground from '../../images/ui/newgame-background.png';

export default class NewGame extends Scene {
    constructor() {
        super({
            key: 'NewGame'
        });
        this.options = new GameOptions();
    }

    preload() {
        this.load.image('newgame-background', newgameBackground);
    }

    create() {
        history.pushState({}, 'Fallen Haven', '/games');
        this.add.image(320, 240, 'newgame-background');

        this.add.existing(new MenuButton(this, { x: 120, y: 149, width: 210, height: 37 }, 'Race', (scene) => {
            this.options.nextRace();
            this.raceText.setText(this.options.displayRace());
        }));
        this.add.existing(new MenuButton(this, { x: 120, y: 197, width: 210, height: 37 }, 'Difficulty', (scene) => {
            this.options.nextDifficulty();
            this.difficultyText.setText(this.options.displayDifficulty());
        }));
        this.add.existing(new MenuButton(this, { x: 330, y: 330, width: 190, height: 37 }, 'Ok', (scene) => {
            this.onStart(this.options);
        }));

        let font = { color: 'white', fontSize: '20px', fontFamily: 'Courier' };
        this.raceText = this.add.text(370, 157, this.options.displayRace(), font);
        this.difficultyText = this.add.text(370, 205, this.options.displayDifficulty(), font);

        var y = 264;
        this.campaignOptions = [];
        for (const campaign in this.options.availableCampaigns) {
            let option = this.add.text(124, y, this.options.displayCampaign(campaign))
                .setInteractive()
                .setBackgroundColor(this.options.campaign == campaign ? '#246B6C' : 'black')
                .on('pointerup', () => {
                    this.campaignOptions.forEach(selected => {
                        let colour = option === selected ? '#246B6C' : 'black';
                        selected.setBackgroundColor(colour)
                    });
                    this.options.campaign = campaign;
                });
            this.campaignOptions.push(option);
            y += 24;
        }
    }

    onStart(options) {
        const { race, difficulty, campaign } = options;
        const data = { race, difficulty, campaign };

        fetch(api('/game'), {
            method: "POST",
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
