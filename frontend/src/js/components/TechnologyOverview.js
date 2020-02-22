import { GameObjects } from "phaser";

const sliderText = [
    {
        key: "energy-efficiency",
        name: 'Energy Efficiency',
        description: 'Affects All Structures. Reduces the energy consumption.'
    },
    {
        key: "armour",
        name: 'Armour Technology',
        description: 'Affects All Structures and Units. Increases Armour.'
    },
    {
        key: "speed",
        name: 'Unit Movement',
        description: 'Affects All Units. Increases AP.'
    },
    {
        key: "weapon-damage",
        name: 'Weapon Damage',
        description: 'Affects All Units. Increases Weapon Damage.'
    },
    {
        key: "rate-of-fire",
        name: 'Rate Of Fire',
        description: 'Affects All Units. Increases Number of Shots per Turn.'
    },
    {
        key: "rocketry",
        name: 'Rocketry',
        description: 'Increases Nuclear Missile precision and Antimissile efficiency.'
    },
];

class TechnologySlider extends GameObjects.Container {

    constructor(scene, x, y, key, name, description, maximum, callback) {
        super(scene, x, y);

        this.key = key;

        let nameText = scene.add.text(26, 2, name, { font: "14px Verdana", color: 'green' });
        this.add(nameText);
        let descriptionText = scene.add.text(45, 23, description, { font: "14px Verdana", color: 'green' });
        this.add(descriptionText);
        this.levelText = scene.add.text(540, 2, description, { font: "14px Verdana", color: 'green' });
        this.add(this.levelText);

        this.researchValue = scene.add.dom().createFromHTML(`<input type="number" min="0" max="${maximum}" class="tech-slider" type="text" name="slider" value="">`)
            .setOrigin(0, 0)
            .setPosition(540 - 120, 2);
        this.add(this.researchValue);

        let slider = this.researchValue.getChildByName('slider');
        slider.oninput = (_event) => {
            callback(slider.value);
        }
    }

    update(value, reference) {
        // TODO: the code for finding the current effect for the current key / research level
        // will have to be shared at some point
        let index = reference.findIndex((element, _index, _arr) => {
            return element.required > value;
        }) - 1;

        if (index < 0 && value > 0) index = reference.length - 1;
        if (index < 0) index = 0;

        let current = reference[index];
        this.levelText.setText(current.name);

        let valueInput = this.researchValue.getChildByName('slider');
        valueInput.value = value;
    }
}

export default class TechnologyOverview extends GameObjects.Container {

    constructor(scene, x, y, game) {
        super(scene, x, y);

        this.game = game;

        let title = scene.add.text(56, 0, 'TECHNOLOGY', { font: "20px Verdana", color: 'green' }).setOrigin(0, 0);
        this.add(title);

        // TODO: move somewhere sensible - also check for duplication between this and credits
        this.totalResearch = Object.values(game.provinces)
            .filter(p => p.owner === game.player.owner)
            .map(p => p.research)
            .reduce((total, current) => total + current);

        let totalResearchText = scene.add.text(56, 27, `Research Production: ${this.totalResearch} RP`, { font: "14px Verdana", color: 'green' }).setOrigin(0, 0);
        this.add(totalResearchText);

        const adjustResearch = (updated, value) => {
            // TODO: check locks and don't just split based equally - ensure locks are locked and split remaining
            let remaining = this.totalResearch - value;
            let equalShare = Math.floor(remaining / (this.sliders.length - 1));
            let data = scene.cache.json.get('data-technology');
            this.sliders.forEach(slider => {
                const updatedValue = (slider === updated) ? value : equalShare;
                slider.update(updatedValue, data[slider.key]);
            });
        }

        this.sliders = sliderText.map(({ key, name, description }, idx) => {
            let slider = new TechnologySlider(scene, 0, 70 + (idx * 40), key, name, description, this.totalResearch, (value) => {
                adjustResearch(slider, value);
            });
            this.add(slider);
            return slider;
        });
    }

    show() {
        let data = this.scene.cache.json.get('data-technology');
        let tech = this.game.player.technology;

        this.sliders.forEach(slider => {
            let current = tech[slider.key];
            let thisTurn = Math.floor(this.totalResearch / this.sliders.length);
            slider.visible = true;
            slider.update(current + thisTurn, data[slider.key]);
        });
    }

    hide() {
        this.sliders.forEach(slider => {
            slider.visible = false;
        })
    }
}

