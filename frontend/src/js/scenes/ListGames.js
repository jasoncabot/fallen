import { Scene } from 'phaser';

import * as api from '../models/API';
import { registerScenePath } from './../components/History';

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
        this.add.text(320, 0, 'Load Game', { color: font.color, fontSize: '24px', fontFamily: font.fontFamily }).setOrigin(0.5, 0);

        let y = 50;
        let allRows = [];
        const colour = {
            default: 0x00AA00,
            highlight: 0x00FF00
        };
        (this.cache.json.get('game-list') || []).forEach((game, idx) => {
            let graphics = this.add.graphics();
            this.renderRow(graphics, y, colour.default);
            allRows.push(graphics);

            this.add.text(75, y, idx + 1, font).setOrigin(0.5, 0.5);
            this.add.text(105, y, game.name, font).setOrigin(0, 0.5);
            this.add.text(310, y, new Date(game.date).toLocaleString(), font).setOrigin(0, 0.5);
            this.add.text(550, y, `${game.kind}-${game.owner}-${game.number}`, font).setOrigin(0, 0.5);

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

    renderRow(graphics, y, colour) {
        graphics.clear();
        graphics.fillStyle(colour, 1);
        graphics.lineStyle(1, colour, 1.0);
        graphics.slice(50, y, 10, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(90), true);
        graphics.fillPath();

        graphics.strokeRectShape(new Phaser.Geom.Rectangle(55, y - 10, 40, 20));
        graphics.strokeRectShape(new Phaser.Geom.Rectangle(100, y - 10, 200, 20));
        graphics.strokeRectShape(new Phaser.Geom.Rectangle(305, y - 10, 240, 20));

        graphics.slice(550, y, 10, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(270), true);
        graphics.fillPath();
    }

}
