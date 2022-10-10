import { GameRow, PlayerGameProjection } from '../../shared/index';
import Phaser, { Scene } from 'phaser';
import * as api from '../models/API';
import { registerScenePath } from './History';

export default class ListGames extends Scene {

    constructor() {
        super({ key: 'ListGames' });
    }

    preload() {
        // Fetch game list during preload
        this.cache.json.remove('game-list');
    }

    create() {
        registerScenePath(this, '/games');

        let font = { color: 'green', fontSize: '18px', fontFamily: 'Verdana' };
        let small = { color: 'green', fontSize: '11px', fontFamily: 'Verdana' };
        this.add.text(320, 0, 'Load Game', { color: font.color, fontSize: '24px', fontFamily: font.fontFamily }).setOrigin(0.5, 0);

        // Fetch and display games
        api.get<GameRow[]>('/games')
            .then(games => {
                let y = 50;
                let allRows: Phaser.GameObjects.Graphics[] = [];
                const colour = {
                    default: 0x00AA00,
                    highlight: 0x00FF00
                };
                (games || []).forEach((game: GameRow, idx: number) => {
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
                        .setInteractive({ useHandCursor: true })
                        .setOrigin(0, 0.5)
                        .on('pointerover', () => {
                            allRows.forEach((row, rowIdx) => {
                                const rowY = 50 + (rowIdx * 30);
                                this.renderRow(row, rowY, (rowIdx === idx) ? colour.highlight : colour.default);
                            });
                        })
                        .on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
                            event.stopPropagation();
                            this.scene.start('LoadGameResources', {
                                gameId: game.id
                            });
                        });
                    y += 30;
                });
            })
            .catch(err => {
                console.error('❌ ListGames: Failed to fetch game list:', err);
                this.add.text(320, 240, `ERROR: Failed to load games\n${err.message}`, {
                    fontSize: '18px',
                    color: '#ff0000',
                    align: 'center'
                }).setOrigin(0.5, 0.5);
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
