import { Scene } from 'phaser';

import { PlayerGameProjection, provinceForKey, provinceSlugForKey, ProvinceKey, Vec2 } from '../../shared/index';

import { createButton, launch, registerButtons, CustomButton } from '../assets/Buttons';
import provincePicker from '../images/ui/provincepicker.png';
import ProvinceMap from './ProvinceMap';

export interface LaunchDataDropship {
    mode: 'DROPSHIP'
    from: ProvinceKey
    gameId: string
    dropship: string
    position: { x: number, y: number }
}

export interface LaunchDataMissile {
    mode: 'MISSILE'
    from: ProvinceKey
    gameId: string
}

export default class Launch extends Scene {
    gameId!: string;
    mode!: string;
    province!: ProvinceKey;
    targetProvince!: ProvinceKey;
    dropship?: string;
    position?: { x: number, y: number };
    provinceMap!: ProvinceMap;
    buttonCancel!: CustomButton;

    // Land a dropship
    buttonLand?: CustomButton;

    // Launch a nuke
    buttonNuke?: CustomButton;

    constructor() {
        super({ key: 'Launch' });
    }

    init(data: LaunchDataDropship | LaunchDataMissile) {
        this.mode = data.mode;
        this.gameId = data.gameId;
        this.province = data.from;

        if (data) {
            this.dropship = (data as LaunchDataDropship).dropship;
            this.position = (data as LaunchDataDropship).position;
        }

        this.targetProvince = data.from;
    }

    preload() {
        this.load.image('launch-province-picker', provincePicker);
        ProvinceMap.preload(this);
        registerButtons(this, launch);
    }

    create() {
        const game = this.cache.json.get(`game-${this.gameId}`) as PlayerGameProjection;

        this.add.image(0, 0, 'launch-province-picker').setOrigin(0);

        this.provinceMap = this.add.existing(new ProvinceMap(this, 32, 34, game, this.province, (province) => {
            this.targetProvince = province;
        }).setScrollFactor(0).setVisible(true));

        if (this.mode === 'DROPSHIP') {
            this.buttonLand = createButton(this, 463, 361, launch.land, (button) => {
                // can't select starting province
                if (this.targetProvince === this.province) return;

                // we must own a touching province
                const destination = provinceForKey(this.targetProvince);
                if (!destination) {
                    console.warn(`⚠️ Launch: Missing province lookup for '${this.targetProvince}'`);
                    return;
                }
                let touchingOwnedProvince = false;
                for (let i = 0; i < destination.touchingLength(); i++) {
                    const touching = destination.touching(i)!;
                    const touchingSlug = provinceSlugForKey(touching);
                    if (touchingSlug && game.provinces[touchingSlug]?.owner === game.player.owner) {
                        touchingOwnedProvince = true;
                        break;
                    }
                }
                if (!touchingOwnedProvince) return;

                const command = {
                    action: 'LAUNCH_DROPSHIP',
                    province: this.province,
                    targetId: this.dropship,
                    targetType: 'structure',
                    position: this.position,
                    targetProvince: this.targetProvince
                };

                // this.game.commandQueue.dispatch(command); // TODO: commandQueue
                this.onInteractionEnded();
            });
        } else if (this.mode === 'MISSILE') {
            this.buttonNuke = createButton(this, 463, 361, launch.nuke, (button) => {
            });
        }
        this.buttonCancel = createButton(this, 463, 417, launch.cancel, (button) => {
            this.onInteractionEnded();
        });
    }

    onInteractionEnded() {
        this.scene.start('LoadGameResources', {
            gameId: this.gameId,
            province: this.province
        });
    }
}
