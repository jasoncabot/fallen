import { Scene } from 'phaser';
import * as api from '../models/API';
import { registerScenePath } from './History';


export default class ListGames extends Scene {

    constructor() {
        super({ key: 'ListGames' });
    }

    preload() {
        this.cache.json.remove('game-list');
        api.getAndCache("/games", this, 'game-list');
    }

    create() {
        registerScenePath(this, '/games');

        let font = { color: 'green', fontSize: '18px', fontFamily: 'Verdana' };
        let small = { color: 'green', fontSize: '11px', fontFamily: 'Verdana' };
        this.add.text(320, 0, 'Load Game', { color: font.color, fontSize: '24px', fontFamily: font.fontFamily }).setOrigin(0.5, 0);

        let y = 50;
        let allRows: Phaser.GameObjects.Graphics[] = [];
        const colour = {
            default: 0x00AA00,
            highlight: 0x00FF00
        };
        (this.cache.json.get('game-list') || []).forEach((game: any, idx: number) => {
            let graphics = this.add.graphics();
            this.renderRow(graphics, y, colour.default);
            allRows.push(graphics);

            this.add.text(30, y, (idx + 1).toString(), font).setOrigin(0.5, 0.5);
            this.add.text(55, y, game.name, font).setOrigin(0, 0.5);
            this.add.text(260, y, new Date(game.date).toLocaleString(), small).setOrigin(0, 0.5);
            this.add.text(400, y, game.kind, small).setOrigin(0, 0.5);
            this.add.text(480, y, game.owner, small).setOrigin(0, 0.5);
            this.add.text(540, y, `Year ${game.number}`, small).setOrigin(0, 0.5);

            this.add.zone(0, y, 640, 30)
                .setInteractive()
                .setOrigin(0, 0.5)
                .on('pointerover', () => {
                    allRows.forEach((row, rowIdx) => {
                        const rowY = 50 + (rowIdx * 30);
                        this.renderRow(row, rowY, (rowIdx === idx) ? colour.highlight : colour.default);
                    });
                })
                .on('pointerup', () => {
                    this.scene.start('LoadGameResources', {
                        gameId: game.id
                    });
                });
            y += 30;
        });
    }

    renderRow(graphics: Phaser.GameObjects.Graphics, y: number, colour: number) {
        graphics.clear();
        graphics.fillStyle(colour, 1);
        graphics.lineStyle(1, colour, 1.0);
        graphics.slice(10, y, 10, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(90), true);
        graphics.fillPath();

        graphics.strokeRectShape(new Phaser.Geom.Rectangle(15, y - 10, 30, 20));
        graphics.strokeRectShape(new Phaser.Geom.Rectangle(50, y - 10, 200, 20));
        graphics.strokeRectShape(new Phaser.Geom.Rectangle(255, y - 10, 135, 20));

        graphics.strokeRectShape(new Phaser.Geom.Rectangle(395, y - 10, 75, 20));
        graphics.strokeRectShape(new Phaser.Geom.Rectangle(475, y - 10, 55, 20));
        graphics.strokeRectShape(new Phaser.Geom.Rectangle(535, y - 10, 55, 20));

        graphics.slice(595, y, 10, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), true);
        graphics.fillPath();
    }

}
