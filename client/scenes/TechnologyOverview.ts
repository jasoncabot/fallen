import Phaser from 'phaser';
import { calculateTotalIncome, PlayerGameProjection, ResearchData, ResearchKey, ResearchValue } from '../../shared/index';
import { GameObjects } from "phaser";

interface TechDescription {
    key: ResearchKey
    name: string
    description: string
}

const sliderText: TechDescription[] = [
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
    key: ResearchKey;
    levelText: GameObjects.Text;
    researchValue: GameObjects.DOMElement;
    value: number;

    constructor(scene: Phaser.Scene, x: number, y: number, key: ResearchKey, name: string, description: string, maximum: number, callback: (value: number) => void) {
        super(scene, x, y);

        this.key = key;

        let nameText = scene.add.text(26, 2, name, { font: "14px Verdana", color: 'green' });
        this.add(nameText);
        let descriptionText = scene.add.text(45, 23, description, { font: "14px Verdana", color: 'green' });
        this.add(descriptionText);
        this.levelText = scene.add.text(540, 2, description, { font: "14px Verdana", color: 'green' });
        this.add(this.levelText);

        this.researchValue = scene.add.dom(0, 0).createFromHTML(`<input type="number" min="0" max="${maximum}" class="tech-slider" type="text" name="slider" value="">`)
            .setOrigin(0, 0)
            .setPosition(540 - 120, 2);
        this.add(this.researchValue);

        let slider = this.researchValue.getChildByName('slider') as HTMLInputElement;
        slider.oninput = (_event) => {
            callback(parseFloat(slider.value));
        }

        this.value = 0;
    }

    update(value: number, reference: ResearchValue[]) {
        // TODO: the code for finding the current effect for the current key / research level
        // will have to be shared at some point
        let index = reference.findIndex((element, _index, _arr) => {
            return element.required > value;
        }) - 1;

        if (index < 0 && value > 0) index = reference.length - 1;
        if (index < 0) index = 0;

        let current = reference[index];
        this.levelText.setText(current.name);

        let valueInput = this.researchValue.getChildByName('slider') as HTMLInputElement;
        valueInput.value = value.toString();

        this.value = value;
    }
}

export default class TechnologyOverview extends GameObjects.Container {
    totalResearch: number;
    game: PlayerGameProjection;
    commandQueue: any[];
    sliders: Record<ResearchKey, TechnologySlider>;

    constructor(scene: Phaser.Scene, x: number, y: number, game: PlayerGameProjection) {
        super(scene, x, y);

        this.game = game;

        this.commandQueue = []; // TODO: add command queue back scene.sys.game.commandQueue;

        let title = scene.add.text(56, 0, 'TECHNOLOGY', { font: "20px Verdana", color: 'green' }).setOrigin(0, 0);
        this.add(title);

        this.totalResearch = calculateTotalIncome(game, 'RESEARCH');

        let totalResearchText = scene.add.text(56, 27, `Research Production: ${this.totalResearch} RP`, { font: "14px Verdana", color: 'green' }).setOrigin(0, 0);
        this.add(totalResearchText);

        const adjustResearch = (updated: TechnologySlider, value: number) => {
            // TODO: check locks and don't just split based equally - ensure locks are locked and split remaining
            let remaining = this.totalResearch - value;
            let equalShare = Math.floor(remaining / (Object.keys(this.sliders).length - 1));
            (Object.keys(this.sliders) as ResearchKey[]).forEach((key: ResearchKey) => {
                const slider = this.sliders[key];
                const updatedValue = (slider === updated) ? value : equalShare;
                slider.update(updatedValue, ResearchData[slider.key]);
            });
        }

        this.sliders = sliderText.reduce((s: Record<ResearchKey, TechnologySlider>, value: TechDescription, idx: number): Record<ResearchKey, TechnologySlider> => {
            let slider = new TechnologySlider(scene, 0, 70 + (idx * 40), value.key, value.name, value.description, this.totalResearch, (value: number) => {
                adjustResearch(slider, value);
            });
            this.add(slider);
            s[value.key] = slider;
            return s;
        }, {} as Record<ResearchKey, TechnologySlider>);
    }

    show() {
        // const tech = this.game.player.technology;

        // const allocation = Object.keys(tech).reduce((r: Record<ResearchKey, number>, key: string): Record<ResearchKey, number> => {
        //     r[keyForTech(key)] = Math.floor(this.totalResearch / Object.keys(this.sliders).length);
        //     return r;
        // }, {} as Record<ResearchKey, number>);

        // this.sliders["armour"].visible = true;

        // Object.keys(this.sliders).forEach(key => {
        //     let current = tech[]  // tech[slider.key];
        //     let thisTurn = allocation[slider.key];
        //     slider.visible = true;
        //     slider.update(current + thisTurn, ResearchData[slider.key]);
        // });
    }

    hide() {
        Object.values(this.sliders).forEach(s => s.visible = false);

        // TODO: this should check if the allocations have changed since the technology scene was opened
        // if (Object.values(updates).filter(update => update !== undefined).length === 0) return;

        // this.commandQueue.dispatch({
        //     "action": "ADJUST_RESEARCH",
        //     "province": null,
        //     "targetId": null,
        //     "targetType": null,
        //     "technology": updates
        // });
    }
}
