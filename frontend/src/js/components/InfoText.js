import { GameObjects } from "phaser";

const kinds = {
    'road': {
        title: 'Construction',
        name: 'Road',
        cost: 5,
    },
    'recycle': {
        title: 'Recycling'
    },
}

export default class InfoText extends GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.titleText = scene.add.text(91, 0, '', { font: "14px Verdana", color: 'green' }).setOrigin(0.5, 0);
        this.add(this.titleText);

        this.subtext1 = scene.add.text(3, 20, '', { font: "11px Verdana", color: 'green' }).setVisible(false);
        this.add(this.subtext1);

        this.subtext2 = scene.add.text(3, 40, '', { font: "11px Verdana", color: 'green' }).setVisible(false);
        this.add(this.subtext2);

        this.dots = [];
        for (let idx = 0; idx < 4; idx++) {
            let dot = scene.add.circle(3 + 5 + (idx * 3) + (idx * 10), 25, 5, 0x00FF00).setOrigin(0.5, 0.5).setVisible(true);
            this.add(dot);
            this.dots.push(dot);
        }
    }

    setConstructionMode(mode) {
        let model = kinds[mode.kind];
        this.titleText.setText(model.title).setVisible(model.title);
        this.subtext1.setText(model.name).setVisible(model.name);
        this.subtext2.setText(`Cost ${model.cost} Credits`).setVisible(model.cost);
        this.dots.forEach(dot => { dot.setVisible(false); });
        return this;
    }

    setUnitMode(unit) {
        this.titleText.setText(unit.name).setVisible(true);
        // TODO: look at experience and create dots
        this.subtext1.setText('').setVisible(false);
        this.subtext2.setText(`Upkeep: ${unit.upkeep} Credits`).setVisible(true);
        this.dots.forEach((dot, idx) => {
            dot.setVisible(idx <= unit.experience);
        });
        return this;
    }

}
