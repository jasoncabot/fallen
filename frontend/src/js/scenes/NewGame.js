import { Scene } from 'phaser';

import { MenuButton, registerScenePath } from '../components';
import { GameOptions } from '../models/GameOptions';

import { NewGameBackground } from '../../images/ui';

export default class NewGame extends Scene {
    constructor() {
        super({
            key: 'NewGame'
        });
        this.options = new GameOptions();
    }

    preload() {
        this.load.image('newgame-background', NewGameBackground);
    }

    create() {
        registerScenePath(this, '/games/new');
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
            this.scene.start("CreateGame", { options: this.options });
        }));

        let font = { color: 'white', fontSize: '16px', fontFamily: 'Verdana' };
        this.raceText = this.add.text(370, 157, this.options.displayRace(), font);
        this.difficultyText = this.add.text(370, 205, this.options.displayDifficulty(), font);

        var y = 264;
        this.campaignOptions = [];
        for (const campaign in this.options.availableCampaigns) {
            let option = this.add.text(124, y, this.options.displayCampaign(campaign), font)
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
}
