import { Scene } from 'phaser';

import { registerButtons, createButton, buttons } from '../assets/Buttons';
import MessageBox from '../components/MessageBox';
import { data } from '../Config';

import strategicMap from '../../images/ui/strategic-map.png';
import { registerScenePath } from './../components/History';


export default class StrategicView extends Scene {
    constructor() {
        super({
            key: 'StrategicView'
        });
    }

    init(data) {
        this.gameId = data.gameId;
        this.view = data.view;
    }

    preload() {
        this.load.image('strategic-map', strategicMap);
        this.load.json('data-provinces', data("/provinces.json"));

        registerButtons(this, buttons.world);
    }

    create() {
        registerScenePath(this, '/games/' + this.gameId);

        const game = this.cache.json.get(`game-${this.gameId}`);

        this.add.image(0, 0, 'strategic-map')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.selectedColony = this.selectedColony ? this.selectedColony : 'haven'; // default to haven being selected
        this.addProvinces(game);

        this.mission = this.add.text(30, 400, "", { color: 'green', fontSize: '14px', fontFamily: 'Verdana' })
            .setVisible(false);

        createButton(this, 246, 401, buttons.world.menu, (button) => { alert('menu'); });
        createButton(this, 349, 399, buttons.world.technology, (button) => { alert('tech'); });
        this.buttonMap = createButton(this, 533, 365, buttons.world.map, (button) => {
            this.scene.start('Play', {
                gameId: this.gameId,
                colony: this.selectedColony,
                view: this.view
            });
        });
        this.buttonZoom = createButton(this, 411, 400, buttons.world.zoom, (button) => { alert('zoom'); });
        createButton(this, 532, 433, buttons.world.endTurn, (button) => {

            const key = 'end-turn-key';
            let box = new MessageBox(key, 160, 150, this, 'End Strategic Turn?');
            box.confirm = () => {
                alert('ending turn');
                this.scene.remove(key);
            }
            box.cancel = () => {
                this.scene.remove(key);
            }
            this.scene.add(key, box, true);
        });

        // call this last to ensure that all buttons/missions are in a consistent state
        this.onSelectedColonyUpdated(game);
    }

    addProvinces(game) {
        const provinceLookup = this.cache.json.get('data-provinces');

        let font = { color: 'green', fontSize: '32px', fontFamily: 'Verdana' };
        var y = 40;
        let provinceOptions = [];
        Object.keys(game.provinces).forEach((province) => {
            let option = this.add.text(30, y, provinceLookup[province].name, font)
                .setInteractive()
                .setBackgroundColor(this.selectedColony === province ? '#246B6C' : 'black')
                .on('pointerup', () => {
                    provinceOptions.forEach(selected => {
                        let colour = option === selected ? '#246B6C' : 'black';
                        selected.setBackgroundColor(colour)
                    });
                    this.selectedColony = province;
                    this.onSelectedColonyUpdated(game);
                });

            this.add.text(30, y + 38,
                `energy: ${provinceLookup[province].energy}, credits: ${provinceLookup[province].credits}, research: ${provinceLookup[province].research}`,
                { color: 'green', fontSize: '14px', fontFamily: 'Verdana' });

            provinceOptions.push(option);
            y += 60;
        });
    }

    onSelectedColonyUpdated(game) {
        let reference = this.cache.json.get('data-provinces')[this.selectedColony];
        let data = game.provinces[this.selectedColony];

        // out of scanning range? hide the zoom button
        // TODO: don't just hardcode this :)
        const scannableProvinces = ['haven', 'eagle-nest'];
        const outOfScanningRange = scannableProvinces.indexOf(this.selectedColony) < 0;
        if (outOfScanningRange) {
            this.buttonZoom.disable();
        } else {
            this.buttonZoom.enable();
        }

        // not owned? hide the map button
        // TODO: this isn't correct - it should be data.owner === game.me
        // but until we have a root game with 2 player specific views (and seeds)
        // this will be fine
        const owned = data.owner === game.turn.owner;
        if (owned) {
            this.buttonMap.enable();
        } else {
            this.buttonMap.disable();
        }

        // mission? show the details
        this.onMissionChanged(data.mission)
    }

    onMissionChanged(mission) {
        if (mission) {
            this.mission.visible = true;
            const text = `MISSION\n${mission.description}\nObjective: ${mission.objective}\nReward: ${mission.reward}`
            this.mission.setText(text);
        } else {
            this.mission.visible = false;
        }
    }
}
