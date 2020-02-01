import { Scene } from 'phaser';

import { MenuButton } from '../components/MenuButton';

import { registerScenePath } from './../components/History';
import { data } from '../Config';

import background from './../../images/ui/encyclopedia-background.png';

import images from './../../images/encyclopedia';

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

        if (this.item) {
            const loweredKey = this.item.toLowerCase();
            Object.keys(images).forEach(key => {
                if (loweredKey === key) {
                    this.load.image(`encyclopedia-${key}`, images[key])
                }
            });
        }
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
        const unit = this.entryForKey(item, 'data-units');
        this.addItemImageAndButtons(unit.encyclopedia);

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        this.add.text(18, 161, "Armor", font);
        this.add.text(173, 161, 5, font);
        this.add.text(18, 196, "Action Points", font);
        this.add.text(173, 196, 5, font);

        const addWeaponText = (weapon, offset) => {
            this.add.text(18, 243 + offset, weapon.name, font);
            this.add.text(18, 261 + offset, "Range", font);
            this.add.text(173, 261 + offset, weapon.range, font);
            this.add.text(18, 296 + offset, "Damage", font);
            this.add.text(173, 296 + offset, weapon.damage.contact, font);
        }

        addWeaponText(unit.weapons.light, 0);
        addWeaponText(unit.weapons.heavy, 99);

        this.add.text(460, 350, unit.kind.name, { color: 'green', fontSize: '40px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);
        this.add.text(460, 400, `${unit.cost} Credits`, { color: 'green', fontSize: '20px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);

    }

    showStructure(item) {
        const structure = this.entryForKey(item, 'data-structures');
        this.addItemImageAndButtons(structure.encyclopedia);

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        this.add.text(18, 161, "Armor", font);
        this.add.text(173, 161, structure.hp, font);
        this.add.text(18, 196, "DESCRIPTION :", font);
        this.add.text(18, 216, structure.encyclopedia.description, font);

        this.add.text(460, 350, structure.kind.name, { color: 'green', fontSize: '40px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);
        this.add.text(460, 400, `${structure.build.cost} Credits`, { color: 'green', fontSize: '20px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);
    }

    entryForKey(item, type) {
        const lookup = this.cache.json.get(type);
        let key = item.toUpperCase();
        let entry = lookup[key].encyclopedia;
        entry.image = `encyclopedia-${key.toLowerCase()}`;
        return lookup[key];
    }

    addItemImageAndButtons(entry) {
        this.add.image(0, 0, entry.image).setOrigin(0, 0);
        this.add.existing(new MenuButton(this, { x: 316, y: 10, width: 98, height: 32 }, "Back", (scene) => {
            scene.start("Encyclopedia", {});
        }));
        if (entry.prev) {
            this.add.existing(new MenuButton(this, { x: 416, y: 10, width: 98, height: 32 }, "< Prev", (scene) => {
                scene.start("Encyclopedia", { category: this.category, item: entry.prev });
            }));
        }
        if (entry.next) {
            this.add.existing(new MenuButton(this, { x: 516, y: 10, width: 98, height: 32 }, "Next >", (scene) => {
                scene.start("Encyclopedia", { category: this.category, item: entry.next });
            }));
        }
    }

    showMenu() {
        this.add.image(3, 13, 'encyclopedia-background').setOrigin(0, 0);
        var y = 180;
        [
            { title: 'Human Units', scene: 'Encyclopedia', item: 'ASQD' },
            { title: 'Neutral Units', scene: 'Encyclopedia', item: 'ASQD' },
            { title: 'Tauran Units', scene: 'Encyclopedia', item: 'ASQD' }
        ].forEach(config => {
            this.add.existing(new MenuButton(this, { x: 193, y, width: 258, height: 38 }, config.title, (scene) => {
                scene.start(config.scene, { category: 'units', item: config.item });
            }));
            y += 40;
        });

        y = 308;
        [
            { title: 'Human Buildings', scene: 'Encyclopedia', item: 'ATUR' },
            { title: 'Tauran Buildings', scene: 'Encyclopedia', item: 'ATUR' }
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
