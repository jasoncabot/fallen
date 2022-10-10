import Phaser, { Scene } from 'phaser';
import newGameBackground from '../images/ui/newgame-background.png';
import { GameOptions } from '../models/GameOptions';
import { registerScenePath } from './History';
import { MenuButton } from './MenuButton';

export default class NewGame extends Scene {
    options: GameOptions;
    raceText!: Phaser.GameObjects.Text;
    difficultyText!: Phaser.GameObjects.Text;
    campaignOptions: Phaser.GameObjects.Text[];

    constructor() {
        super({
            key: 'NewGame'
        });
        this.options = new GameOptions();
        this.campaignOptions = [];
    }

    preload() {
        this.load.image('newgame-background', newGameBackground);
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
        this.campaignOptions = this.options.availableCampaigns().map((name: string, idx: number) => {
            let option = this.add.text(124, 264 + (idx * 24), name, font)
                .setInteractive({ useHandCursor: true })
                .setBackgroundColor(this.options.campaign == idx ? '#246B6C' : 'black')
                .on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                    event.stopPropagation();
                    this.campaignOptions.forEach(selected => {
                        let colour = option === selected ? '#246B6C' : 'black';
                        selected.setBackgroundColor(colour)
                    });
                    this.options.campaign = idx;
                });
            return option;
        })
    }
}
