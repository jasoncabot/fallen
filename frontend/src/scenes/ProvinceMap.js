import Phaser from 'phaser';

import { ProvinceData } from 'shared';

import {
    ColoniesFallen,
    ColoniesLastHope,
    ProvincesFallen,
    ProvincesFallenData,
    ProvincesCapitalAlien,
    ProvincesCapitalHuman,
    ProvincesMission,
} from '../images/ui';

export default class ProvinceMap extends Phaser.GameObjects.Container {

    static preload(scene) {
        scene.load.image('provinces-capital-alien', ProvincesCapitalAlien);
        scene.load.image('provinces-capital-human', ProvincesCapitalHuman);
        scene.load.image('provinces-mission', ProvincesMission);
        scene.load.image('colonies-fallen', ColoniesFallen);
        scene.load.atlas('provinces-fallen', ProvincesFallen, ProvincesFallenData);
    }

    constructor(scene, x, y, game, selectedProvince, onSelectionChanged) {
        super(scene, x, y);

        let provinceOptions = [];
        this.add(this.scene.add.image(0, 0, 'colonies-fallen')
            .setOrigin(0)
            .setScrollFactor(0));

        let colourForOwner = (owner) => {
            switch (owner) {
                case 'HUMAN': return 'blue';
                case 'ALIEN': return 'red';
            }
            return 'grey';
        }

        // add each selectable province
        Object.keys(game.provinces).forEach((province) => {

            const { x, y, iconX, iconY } = ProvinceData[province];
            const { owner, mission, capital } = game.provinces[province];
            const frame = `${province}-${colourForOwner(owner)}-${selectedProvince === province ? 'highlight' : 'default'}`;

            const option = this.scene.add.image(x, y, 'provinces-fallen', frame)
                .setInteractive({
                    pixelPerfect: true,
                    useHandCursor: true
                })
                .on('pointerup', () => {
                    provinceOptions.forEach(selected => {
                        selected.setFrame(`${selected.getData('province')}-${colourForOwner(selected.getData('owner'))}-default`);
                    });
                    onSelectionChanged(province);
                    option.setFrame(`${province}-${colourForOwner(owner)}-highlight`);
                })
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setData('province', province)
                .setData('owner', owner);

            this.add(option);

            provinceOptions.push(option);

            // add any icons that sit above the province
            if (mission) {
                this.add(this.scene.add.image(iconX, iconY, 'provinces-mission'));
            }

            if (capital) {
                if (capital === 'HUMAN') {
                    this.add(this.scene.add.image(iconX, iconY, 'provinces-capital-human'));
                } else {
                    this.add(this.scene.add.image(iconX, iconY, 'provinces-capital-alien'));
                }
            }
        });
    }
}
