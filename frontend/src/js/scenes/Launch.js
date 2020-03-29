import { Scene } from 'phaser';

import { ProvincePicker } from '../../images/ui';
import { ProvinceMap } from '../components';
import { registerButtons, createButton, buttons } from '../assets/Buttons';

export default class Launch extends Scene {

    constructor() {
        super({ key: 'Launch' });
    }

    init(data) {
        this.mode = data.mode;
        this.gameId = data.gameId;
        this.province = data.from;

        this.dropship = data.dropship;
        this.position = data.position;

        this.targetProvince = null;
    }

    preload() {
        this.load.image('launch-province-picker', ProvincePicker);
        ProvinceMap.preload(this);
        registerButtons(this, buttons.launch);
    }

    create() {
        const game = this.cache.json.get(`game-${this.gameId}`);

        this.add.image(0, 0, 'launch-province-picker').setOrigin(0);

        this.provinceMap = this.add.existing(new ProvinceMap(this, 32, 34, game, this.province, (province) => {
            this.targetProvince = province;
        }).setScrollFactor(0).setVisible(true));

        if (this.mode === 'DROPSHIP') {
            this.buttonLand = createButton(this, 463, 361, buttons.launch.land, (button) => {
                const command = {
                    action: 'LAUNCH_DROPSHIP',
                    province: this.province,
                    targetId: this.dropship,
                    targetType: 'structure',
                    position: this.position,
                    targetProvince: this.targetProvince
                };

                // TODO: dispatch this command to the appropriate place
                console.log('Dispatching command: ' + JSON.stringify(command));
            });
        } else if (this.mode === 'MISSILE') {
            this.buttonNuke = createButton(this, 463, 361, buttons.launch.nuke, (button) => {
            });
        }
        this.buttonCancel = createButton(this, 463, 417, buttons.launch.cancel, (button) => {
            this.scene.start('LoadGameResources', {
                gameId: this.gameId,
                province: this.province
            });
        });
    }
}
