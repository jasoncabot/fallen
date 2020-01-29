import { Scene } from 'phaser';

import { MenuButton } from '../components/MenuButton';

import { registerScenePath } from './../components/History';
import { data } from '../Config';

import background from './../../images/ui/encyclopedia-background.png';

// TODO: not this
import asqu from './../../images/encyclopedia/asqu.png';
import ashp from './../../images/encyclopedia/ashp.png';
import aair from './../../images/encyclopedia/aair.png';

export default class Encyclopedia extends Scene {

    constructor() {
        super({ key: 'Encyclopedia' });
    }

    init(data) {
        this.category = data.category;
        this.item = data.item;
    }

    preload() {
        if (this.category === 'units') this.load.json('data-units', data("/units.json"));
        if (this.category === 'structures') this.load.json('data-structures', data("/structures.json"));
        this.load.image('encyclopedia-background', background);

        // TODO: not this
        this.load.image('encyclopedia-asqu', asqu);
        this.load.image('encyclopedia-ashp', ashp);
        this.load.image('encyclopedia-aair', aair);
    }

    create() {
        var path = '/encyclopedia';
        if (this.category && this.item) {
            path += '/' + this.category + '/' + this.item;
        }
        registerScenePath(this, path);

        if (this.category === 'units' && this.item) {
            this.showUnit(this.item);
        } else if (this.category === 'structures' && this.item) {
            this.showStructure(this.item);
        } else {
            this.showMenu();
        }
    }

    showUnit(item) {
        const units = this.cache.json.get('data-units');
        let current = units[item].encyclopedia;
        this.addItemImageAndButtons(current);
    }

    showStructure(item) {
        const structures = this.cache.json.get('data-structures');
        let current = structures[item].encyclopedia;
        this.addItemImageAndButtons(current);
    }

    addItemImageAndButtons(current) {
        this.add.image(0, 0, current.image).setOrigin(0, 0);
        this.add.existing(new MenuButton(this, { x: 316, y: 10, width: 98, height: 32 }, "Back", (scene) => {
            scene.start("Encyclopedia", {});
        }));
        this.add.existing(new MenuButton(this, { x: 416, y: 10, width: 98, height: 32 }, "< Prev", (scene) => {
            scene.start("Encyclopedia", { category: this.category, item: current.prev });
        }));
        this.add.existing(new MenuButton(this, { x: 516, y: 10, width: 98, height: 32 }, "Next >", (scene) => {
            scene.start("Encyclopedia", { category: this.category, item: current.next });
        }));
    }

    showMenu() {
        this.add.image(3, 13, 'encyclopedia-background').setOrigin(0, 0);
        var y = 180;
        [
            { title: 'Human Units', scene: 'Encyclopedia', item: 'ASQU' },
            { title: 'Neutral Units', scene: 'Encyclopedia', item: 'ASQU' },
            { title: 'Tauran Units', scene: 'Encyclopedia', item: 'ASQU' }
        ].forEach(config => {
            this.add.existing(new MenuButton(this, { x: 193, y, width: 258, height: 38 }, config.title, (scene) => {
                scene.start(config.scene, { category: 'units', item: config.item });
            }));
            y += 40;
        });

        y = 308;
        [
            { title: 'Human Buildings', scene: 'Encyclopedia', item: 'ASHP' },
            { title: 'Tauran Buildings', scene: 'Encyclopedia', item: 'ASHP' }
        ].forEach(config => {
            this.add.existing(new MenuButton(this, { x: 193, y, width: 258, height: 38 }, config.title, (scene) => {
                scene.start(config.scene, { category: 'structures', item: config.item });
            }));
            y += 40;
        });

        y = 396;
        this.add.existing(new MenuButton(this, { x: 193, y, width: 258, height: 38 }, "Back", (scene) => {
            scene.start("MainMenu");
        }));
    }

}
