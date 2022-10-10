import { Scene } from 'phaser';
import { registerScenePath } from './History';
import { MenuButton } from './MenuButton';
import { StructureCategory, StructureData, WeaponData, UnitCategory, UnitData } from '@fallen/shared';
import { EncyclopediaEntry } from 'structures';
import { images as encyclopediaImages } from '../images/encyclopedia';
import encyclopediaBackground from '../images/ui/encyclopedia-background.png';

interface EncyclopediaItem {
    category: "units" | "structures"
    item: StructureCategory | UnitCategory
}

export default class Encyclopedia extends Scene {
    category!: "units" | "structures" | undefined;
    item: StructureCategory | UnitCategory | undefined;

    constructor() {
        super({ key: 'Encyclopedia' });
    }

    init(data: EncyclopediaItem) {
        this.category = data.category;
        this.item = data.item;
    }

    preload() {
        this.load.image('encyclopedia-background', encyclopediaBackground);

        Object.keys(encyclopediaImages).forEach(key => {
            this.load.image(`encyclopedia-${key}`, encyclopediaImages[key]);
        });
    }

    create() {
        var path = '/encyclopedia';
        if (this.category && this.item) {
            path += '/' + this.category + '/' + this.item;
        }
        registerScenePath(this, path);

        if (this.category === 'units' && this.item) {
            this.showUnit(this.item as UnitCategory);
        } else if (this.category === 'structures' && this.item) {
            this.showStructure(this.item as StructureCategory);
        } else {
            this.showMenu();
        }
    }

    showUnit(item: UnitCategory) {
        const unit = UnitData[item];
        this.addItemImageAndButtons(`encyclopedia-${item.toLowerCase()}`, unit.encyclopedia);

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        this.add.text(18, 161, "Armour", font);
        this.add.text(173, 161, unit.hp.toString(), font);
        this.add.text(18, 196, "Action Points", font);
        this.add.text(173, 196, unit.actionPoints.toString(), font);

        const addWeaponText = (weapon: WeaponData, offset: number) => {
            this.add.text(18, 243 + offset, weapon.name, font);
            this.add.text(18, 261 + offset, "Range", font);
            this.add.text(173, 261 + offset, weapon.range.toString(), font);
            this.add.text(18, 296 + offset, "Damage", font);
            this.add.text(173, 296 + offset, weapon.damage.contact.toString(), font);
        }

        addWeaponText(unit.weapons.light, 0);
        addWeaponText(unit.weapons.heavy, 99);

        this.add.text(460, 350, unit.kind.name, { color: 'green', fontSize: '40px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);
        this.add.text(460, 400, `${unit.cost} Credits`, { color: 'green', fontSize: '20px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);

    }

    showStructure(item: StructureCategory) {
        const structure = StructureData[item];
        this.addItemImageAndButtons(`encyclopedia-${item.toLowerCase()}`, structure.encyclopedia);

        let font = { color: 'green', fontSize: '12px', fontFamily: 'Verdana' };
        this.add.text(18, 161, "Armour", font);
        this.add.text(173, 161, structure.hp.toString(), font);
        this.add.text(18, 196, "DESCRIPTION :", font);
        this.add.text(18, 216, structure.encyclopedia.description, {
            color: 'green',
            fontSize: '12px',
            fontFamily: 'Verdana',
            wordWrap: { width: 240, useAdvancedWrap: true }
        });

        this.add.text(460, 350, structure.kind.name, { color: 'green', fontSize: '40px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);
        this.add.text(460, 400, `${structure.build.cost} Credits`, { color: 'green', fontSize: '20px', fontFamily: 'Verdana' }).setOrigin(0.5, 0);
    }

    addItemImageAndButtons(image: string, entry: EncyclopediaEntry<UnitCategory | StructureCategory>) {
        this.add.image(0, 0, image).setOrigin(0, 0);
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
            { title: 'Human Units', scene: 'Encyclopedia', item: 'HSQU' as UnitCategory },
            { title: 'Neutral Units', scene: 'Encyclopedia', item: 'NATV' as UnitCategory },
            { title: 'Tauran Units', scene: 'Encyclopedia', item: 'ASQD' as UnitCategory }
        ].forEach(config => {
            this.add.existing(new MenuButton(this, { x: 193, y, width: 258, height: 38 }, config.title, (scene) => {
                scene.start(config.scene, { category: 'units', item: config.item });
            }));
            y += 40;
        });

        y = 308;
        [
            { title: 'Human Buildings', scene: 'Encyclopedia', item: 'HTUR' as StructureCategory },
            { title: 'Tauran Buildings', scene: 'Encyclopedia', item: 'ATUR' as StructureCategory }
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
