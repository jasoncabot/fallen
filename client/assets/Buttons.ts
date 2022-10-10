import Phaser from 'phaser';
import buttonsConfirmCancel from '../images/buttons/confirm-cancel.png';
import buttonsConfirmCancelData from '../images/buttons/confirm-cancel.json';
import buttonsDone from '../images/buttons/done.png';
import buttonsDoneData from '../images/buttons/done.json';
import buttonsLaunch from '../images/buttons/launch.png';
import buttonsLaunchData from '../images/buttons/launch.json';
import buttonsManufacturing from '../images/buttons/manufacturing.png';
import buttonsManufacturingData from '../images/buttons/manufacturing.json';
import buttonsStrategic from '../images/buttons/strategic.png';
import buttonsStrategicData from '../images/buttons/strategic.json';
import buttonsTactical from '../images/buttons/tactical.png';
import buttonsTacticalData from '../images/buttons/tactical.json';
import buttonsWorld from '../images/buttons/world.png';
import buttonsWorldData from '../images/buttons/world.json';

export interface ButtonDataFrame {
    filename: string
    frame: {
        x: number
        y: number
        w: number
        h: number
    }
    anchor: {
        x: number,
        y: number
    }
};

export interface ButtonConfig {
    asset: {
        key: string
        atlas: string
        data: {
            frames: ButtonDataFrame[]
        }
    },
};

export interface CustomButton extends Phaser.GameObjects.Image {
    disable(): void
    enable(): void
    setHighlight(on: boolean): void
}

export const createButton = (scene: Phaser.Scene, x: number, y: number, config: any, callback: (button: Phaser.GameObjects.Image) => void) => {
    const restFrame = `${config.name}_0`;
    const hoverFrame = `${config.name}_1`;
    const activeFrame = `${config.name}_2`;
    const disabledFrame = `${config.name}_3`;

    const hitArea = new Phaser.Geom.Polygon(config.hitArea);
    const interactiveConfig: Phaser.Types.Input.InputConfiguration = {
        hitArea,
        hitAreaCallback: Phaser.Geom.Polygon.Contains,
        useHandCursor: true
    };

    let isDisabled = false;
    let isHighlighted = false;

    const button: CustomButton = scene.add.image(x, y, config.atlas, config.name + '_0')
        .setInteractive(interactiveConfig)
        .setOrigin(0, 0) as CustomButton;

    button.on('pointerover', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, _event: Phaser.Types.Input.EventData) => {
        if (!isHighlighted && !isDisabled) {
            button.setFrame(hoverFrame);
        }
    });
    button.on('pointerout', () => {
        if (!isHighlighted && !isDisabled) {
            button.setFrame(restFrame);
        }
    });
    button.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
        if (isDisabled) return;
        button.setFrame(activeFrame);
        event.stopPropagation();
    });
    button.on('pointerup', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
        if (isDisabled) return;
        button.setFrame(isHighlighted ? activeFrame : restFrame);
        event.stopPropagation();
        callback(button);
    });
    button.disable = () => {
        isDisabled = true;
        button.disableInteractive();
        button.setFrame(disabledFrame);
    }
    button.enable = () => {
        isDisabled = false;
        button.setFrame(isHighlighted ? activeFrame : restFrame);
        button.setInteractive(interactiveConfig);
    }
    button.setHighlight = (value: boolean) => {
        isHighlighted = value;
        if (!isDisabled) {
            button.setFrame(value ? activeFrame : restFrame);
        }
    }

    return button;
}

export const registerButtons = (scene: Phaser.Scene, config: ButtonConfig) => {
    for (let [key, value] of Object.entries(config)) {
        if (key === 'asset') continue;
        value.atlas = config.asset?.key!;
        value.name = key;
    }
    scene.load.atlas(config.asset?.key!, config.asset?.atlas, config.asset?.data);
    return config;
}

export const confirmCancel = {
    asset: {
        key: 'buttonsConfirmCancel',
        atlas: buttonsConfirmCancel,
        data: buttonsConfirmCancelData,
    },
    confirm: {
        hitArea: [0, 0, 80, 0, 80, 36, 0, 36]
    },
    ok: {
        hitArea: [0, 0, 74, 0, 74, 38, 0, 38]
    },
    cancel: {
        hitArea: [0, 0, 80, 0, 80, 36, 0, 36]
    },
    accept: {
        hitArea: [0, 0, 79, 0, 79, 27, 0, 27]
    }
} as ButtonConfig & any;

export const done = {
    asset: {
        key: 'buttonsDone',
        atlas: buttonsDone,
        data: buttonsDoneData,
    },
    done: {
        hitArea: [2, 0, 57, 0, 57, 67, 0, 67, 0, 64, 12, 52, 12, 50, 13, 49, 13, 18, 12, 17, 12, 15, 2, 2, 2, 0]
    }
} as ButtonConfig & any;

export const launch = {
    asset: {
        key: 'buttonsLaunch',
        atlas: buttonsLaunch,
        data: buttonsLaunchData,
    },
    land: {
        hitArea: [0, 22, 4, 12, 9, 7, 14, 4, 23, 2, 33, 0, 104, 0, 104, 44, 0, 44]
    },
    nuke: {
        hitArea: [0, 22, 4, 12, 9, 7, 14, 4, 23, 2, 33, 0, 104, 0, 104, 44, 0, 44]
    },
    cancel: {
        hitArea: [29, 45, 19, 43, 13, 41, 8, 38, 4, 33, 0, 25, 0, 0, 104, 0, 104, 45]
    }
} as ButtonConfig & any;

export const manufacturing = {
    asset: {
        key: 'buttonsManufacturing',
        atlas: buttonsManufacturing,
        data: buttonsManufacturingData,
    },
    ok: {
        hitArea: [14, 0, 98, 0, 103, 4, 103, 34, 98, 38, 14, 38, 6, 31, 6, 30, 2, 24, 2, 21, 0, 19, 0, 14, 7, 4, 8, 4]
    },
    up: {
        hitArea: [-4, -11, 40, -11, 40, 33, -4, 33]
    },
    down: {
        hitArea: [-4, -11, 40, -11, 40, 33, -4, 33]
    }
} as ButtonConfig & any;

export const strategic = {
    asset: {
        key: 'buttonsStrategic',
        atlas: buttonsStrategic,
        data: buttonsStrategicData,
    },
    repair: {
        hitArea: [0, 0, 32, 0, 46, 19, 46, 50, 33, 69, 0, 69]
    },
    build: {
        hitArea: [0, 0, 53, 0, 74, 34, 74, 68, 0, 68, 0, 66, 12, 50, 12, 22, 0, 2]
    },
    road: {
        hitArea: [0, 0, 80, 0, 80, 2, 41, 68, 19, 68, 19, 32, 0, 2]
    },
    recycle: {
        hitArea: [39, 0, 58, 0, 58, 68, 0, 68, 0, 65]
    },
    map: {
        hitArea: [0, 0, 55, 0, 79, 65, 79, 68, 0, 68]
    },
    menu: {
        hitArea: [0, 0, 82, 0, 82, 2, 71, 18, 71, 52, 82, 66, 82, 68, 24, 68, 0, 1]
    },
    colony: {
        hitArea: [15, 0, 64, 0, 64, 68, 14, 68, 0, 50, 0, 19,]
    },

} as ButtonConfig & any;

export const tactical = {
    asset: {
        key: 'buttonsTactical',
        atlas: buttonsTactical,
        data: buttonsTacticalData,
    },
    menu: {
        hitArea: []
    },
    next: {
        hitArea: []
    },
    nextNoReturn: {
        hitArea: []
    },
    watchLight: {
        hitArea: []
    },
    fireLight: {
        hitArea: []
    },
    fireHeavy: {
        hitArea: []
    },
    watchHeavy: {
        hitArea: []
    },
    map: {
        hitArea: []
    },
    endTurn: {
        hitArea: []
    },
    destruct: {
        hitArea: []
    }
} as ButtonConfig & any;

export const world = {
    asset: {
        key: 'buttonsWorld',
        atlas: buttonsWorld,
        data: buttonsWorldData,
    },
    menu: {
        hitArea: [0, 0, 64, 0, 64, 66, 0, 66]
    },
    technology: {
        hitArea: [0, 0, 70, 0, 70, 2, 27, 67, 0, 67]
    },
    map: {
        hitArea: [52, 0, 68, 0, 76, 2, 78, 3, 82, 4, 94, 12, 94, 53, 0, 53, 0, 48, 4, 36, 14, 21, 25, 11, 40, 3]
    },
    zoom: {
        hitArea: [43, 0, 69, 0, 69, 67, 0, 67, 0, 64]
    },
    endTurn: {
        hitArea: [0, 0, 95, 0, 95, 41, 17, 41, 13, 37, 13, 36, 7, 28, 3, 19, 0, 8]
    }
} as ButtonConfig & any;
