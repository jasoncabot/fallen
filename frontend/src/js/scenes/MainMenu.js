import { Scene } from 'phaser';

import { MenuButton, registerScenePath } from '../components';

import background from '../../images/ui/mainmenu-background.png';

export default class MainMenu extends Scene {

    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', background);
    }

    create() {
        registerScenePath(this, '/');
        this.add.image(0, -20, 'background').setOrigin(0, 0);

        var y = 210;
        [
            { title: 'New', scene: 'NewGame' },
            { title: 'Resume', scene: 'ListGames' },
            { title: 'Encyclopedia', scene: 'Encyclopedia' }
        ].forEach(config => {
            this.add.existing(new MenuButton(this, { x: 170, y, width: 300, height: 38 }, config.title, (scene) => {
                scene.start(config.scene);
            }));
            y += 74;
        });
    }

}
