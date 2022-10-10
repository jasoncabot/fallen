import { Scene } from 'phaser';
import mainMenuBackground from '../images/ui/mainmenu-background.png';
import { registerScenePath } from './History';
import { MenuButton } from './MenuButton';

export default class MainMenu extends Scene {

    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        console.log('🔄 MainMenu: preload - loading background image');
        this.load.image('background', mainMenuBackground);
    }

    create() {
        console.log('🎮 MainMenu: create - displaying menu');
        registerScenePath(this, '/');

        // Add semi-transparent background overlay to show canvas is active
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRect(0, 0, 640, 480);

        // Try to add the background image
        try {
            const bg = this.add.image(0, -20, 'background');
            bg.setOrigin(0, 0);
            console.log('✓ MainMenu: Background image added');
        } catch (err) {
            console.error('❌ MainMenu: Failed to add background:', err);
            // Add fallback: simple text
            this.add.text(320, 100, 'FALLEN HAVEN', {
                fontSize: '48px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5, 0.5);
        }

        // Add menu buttons
        var y = 210;
        [
            { title: 'New', scene: 'NewGame' },
            { title: 'Resume', scene: 'ListGames' },
            { title: 'Encyclopedia', scene: 'Encyclopedia' }
        ].forEach(config => {
            try {
                this.add.existing(new MenuButton(this, { x: 170, y, width: 300, height: 38 }, config.title, (scene) => {
                    console.log('📌 MainMenu: Button clicked -', config.title);
                    scene.start(config.scene);
                }));
                console.log('✓ MainMenu: Button added -', config.title);
            } catch (err) {
                console.error('❌ MainMenu: Failed to add button:', config.title, err);
            }
            y += 74;
        });

        console.log('✓ MainMenu: Scene fully created');
    }

}
