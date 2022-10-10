import { Alliance, PlayerGameProjection, provinceForKey, ProvinceKey } from '../../shared/index';

import Phaser from 'phaser';

import ColoniesFallen from "../images/ui/colonies-fallen.png";
import ColoniesLastHope from "../images/ui/colonies-lasthope.png";
import ProvincesCapitalAlien from "../images/ui/provinces-capital-alien.png";
import ProvincesCapitalHuman from "../images/ui/provinces-capital-human.png";
import ProvincesFallenData from "../images/ui/provinces-fallen.json";
import ProvincesFallen from "../images/ui/provinces-fallen.png";
import ProvincesMission from "../images/ui/provinces-mission.png";

export default class ProvinceMap extends Phaser.GameObjects.Container {

    static preload(scene: Phaser.Scene) {
        scene.load.image('provinces-capital-alien', ProvincesCapitalAlien);
        scene.load.image('provinces-capital-human', ProvincesCapitalHuman);
        scene.load.image('provinces-mission', ProvincesMission);
        scene.load.image('colonies-fallen', ColoniesFallen);
        scene.load.image('colonies-fallen', ColoniesLastHope);
        scene.load.atlas('provinces-fallen', ProvincesFallen, ProvincesFallenData);
    }

    constructor(scene: Phaser.Scene, x: number, y: number, game: PlayerGameProjection, selectedProvince: ProvinceKey, onSelectionChanged: (province: ProvinceKey) => void) {
        super(scene, x, y);

        let provinceOptions: Phaser.GameObjects.Image[] = [];
        this.add(this.scene.add.image(0, 0, 'colonies-fallen')
            .setOrigin(0)
            .setScrollFactor(0));

        let colourForOwner = (owner: Alliance) => {
            switch (owner) {
                case 'HUMAN': return 'blue';
                case 'ALIEN': return 'red';
            }
            return 'grey';
        }

        // add each selectable province
        Object.keys(game.provinces).forEach((key: string) => {
            const province = provinceForKey(key as unknown as ProvinceKey);
            if (!province) {
                console.warn(`⚠️ ProvinceMap: Missing province lookup for key '${key}'`);
                return;
            }

            const provinceKey = province.key();
            const provinceState = game.provinces[provinceKey];
            if (!provinceState) {
                console.warn(`⚠️ ProvinceMap: Missing game province state for key '${provinceKey}'`);
                return;
            }

            const { owner, mission, capital } = provinceState;
            const frame = `${provinceKey}-${colourForOwner(owner)}-${selectedProvince === provinceKey ? 'highlight' : 'default'}`;

            const option = this.scene.add.image(x, y, 'provinces-fallen', frame)
                .setInteractive({
                    pixelPerfect: true,
                    useHandCursor: true
                })
                .on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                    event.stopPropagation();
                    provinceOptions.forEach(selected => {
                        selected.setFrame(`${selected.getData('province')}-${colourForOwner(selected.getData('owner'))}-default`);
                    });
                    onSelectionChanged(provinceKey);
                    option.setFrame(`${provinceKey}-${colourForOwner(owner)}-highlight`);
                })
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setData('province', provinceKey)
                .setData('owner', owner);

            this.add(option);

            provinceOptions.push(option);

            // add any icons that sit above the province
            if (mission) {
                this.add(this.scene.add.image(province.iconPos()!.x(), province.iconPos()!.y(), 'provinces-mission'));
            }

            if (capital) {
                if (capital === 'HUMAN') {
                    this.add(this.scene.add.image(province.iconPos()!.x(), province.iconPos()!.y(), 'provinces-capital-human'));
                } else {
                    this.add(this.scene.add.image(province.iconPos()!.x(), province.iconPos()!.y(), 'provinces-capital-alien'));
                }
            }
        });
    }
}
