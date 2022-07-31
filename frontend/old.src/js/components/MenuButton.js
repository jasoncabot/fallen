import Phaser from 'phaser';

const style = {
    text: {
        rest: '#000',
        hover: '#444',
        active: '#666'
    },
    outline: {
        rest: 0x000000,
        hover: 0x333333,
        active: 0x000000
    },
    bg: {
        rest: 0xEAE2E5,
        hover: 0xFAF2F5,
        active: 0xCAC2C5
    },
}

export class MenuButton extends Phaser.GameObjects.Graphics {
    constructor(scene, rect, text, callback) {
        let x = rect.x;
        let y = rect.y;
        super(scene, { x, y });

        this.backgroundBounds = new Phaser.Geom.Rectangle(1, 1, rect.width - 1, rect.height - 1);

        this.text = scene.add.text(x, y + 8, text, { font: "16px Verdana", fill: style.text.rest });
        this.text.setAlign('center');
        this.text.setFixedSize(rect.width, rect.height);
        this.text.setDepth(1);

        this.enterButtonRestState();

        this.setInteractive(this.backgroundBounds, Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {
                this.enterButtonHoverState();
                callback(scene.scene);
            });
    }

    enterButtonHoverState() {
        this.lineStyle(2, style.outline.hover, 1.0);
        this.strokeRectShape(this.backgroundBounds);
        this.fillStyle(style.bg.hover, 1.0);
        this.fillRectShape(this.backgroundBounds);
        this.text.setStyle({ fill: style.text.hover });
    }

    enterButtonRestState() {
        this.lineStyle(2, style.outline.rest, 1.0);
        this.strokeRectShape(this.backgroundBounds);
        this.fillStyle(style.bg.rest, 1.0);
        this.fillRectShape(this.backgroundBounds);
        this.text.setStyle({ fill: style.text.rest });
    }

    enterButtonActiveState() {
        this.lineStyle(2, style.outline.active, 1.0);
        this.strokeRectShape(this.backgroundBounds);
        this.fillStyle(style.bg.active, 1.0);
        this.fillRectShape(this.backgroundBounds);
        this.text.setStyle({ fill: style.text.active });
    }
}
