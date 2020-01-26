import buttonsConfirmCancel from '../../images/buttons/confirm-cancel.png';
import buttonsConfirmCancelData from '../../images/buttons/confirm-cancel.json';
import buttonsDone from '../../images/buttons/done.png';
import buttonsDoneData from '../../images/buttons/done.json';
import buttonsLaunch from '../../images/buttons/launch.png';
import buttonsLaunchData from '../../images/buttons/launch.json';
import buttonsManufacturing from '../../images/buttons/manufacturing.png';
import buttonsManufacturingData from '../../images/buttons/manufacturing.json';
import buttonsStrategic from '../../images/buttons/strategic.png';
import buttonsStrategicData from '../../images/buttons/strategic.json';
import buttonsTactical from '../../images/buttons/tactical.png';
import buttonsTacticalData from '../../images/buttons/tactical.json';
import buttonsWorld from '../../images/buttons/world.png';
import buttonsWorldData from '../../images/buttons/world.json';

const createButton = (scene, x, y, config, callback) => {
    let button = scene.add.image(x, y, config.atlas, config.name + '_0')
        .setInteractive({
            hitArea: new Phaser.Geom.Polygon(config.hitArea),
            hitAreaCallback: Phaser.Geom.Polygon.Contains,
            useHandCursor: true
        })
        .setOrigin(0, 0)
        .setScrollFactor(0);

    button.on('pointerover', () => { button.setFrame(config.name + '_1'); });
    button.on('pointerout', () => { button.setFrame(config.name + '_0'); });
    button.on('pointerdown', () => { button.setFrame(config.name + '_2'); });
    button.on('pointerup', () => {
        button.setFrame(config.name + '_0');
        callback(button);
    });

    return button;
}

const registerButtons = (scene, config) => {
    // add parent information into the child to make it easier to look it up
    // when we only have a reference to the child
    for (let [key, value] of Object.entries(config)) {
        if (key === 'asset') continue;
        value['atlas'] = config.asset.key;
        value['name'] = key;
    }
    scene.load.atlas(config.asset.key, config.asset.atlas, config.asset.data);
    return config;
}

const confirmCancel = {
    asset: {
        key: 'buttonsConfirmCancel',
        atlas: buttonsConfirmCancel,
        data: buttonsConfirmCancelData,
    },
    confirm: {
        hitArea: []
    },
    ok: {
        hitArea: []
    },
    cancel: {
        hitArea: []
    },
    accept: {
        hitArea: []
    }
};
const done = {
    asset: {
        key: 'buttonsDone',
        atlas: buttonsDone,
        data: buttonsDoneData,
    },
    done: {
        hitArea: []
    }
};
const launch = {
    asset: {
        key: 'buttonsLaunch',
        atlas: buttonsLaunch,
        data: buttonsLaunchData,
    },
    land: {
        hitArea: []
    },
    nuke: {
        hitArea: []
    },
    cancel: {
        hitArea: []
    }
};
const manufacturing = {
    asset: {
        key: 'buttonsManufacturing',
        atlas: buttonsManufacturing,
        data: buttonsManufacturingData,
    },
    ok: {
        hitArea: [14, 0, 98, 0, 103, 4, 103, 34, 98, 38, 14, 38, 6, 31, 6, 30, 2, 24, 2, 21, 0, 19, 0, 14, 7, 4, 8, 4]
    },
    up: {
        hitArea: [16, 0, 19, 0, 35, 16, 35, 17, 0, 17, 0, 16, 16, 0]
    },
    down: {
        hitArea: [0, 0, 35, 0, 35, 1, 19, 17, 16, 17, 0, 1]
    }
};
const strategic = {
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

};
const tactical = {
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
};
const world = {
    asset: {
        key: 'buttonsWorld',
        atlas: buttonsWorld,
        data: buttonsWorldData,
    },
    menu: {
        hitArea: []
    },
    technology: {
        hitArea: []
    },
    map: {
        hitArea: []
    },
    zoom: {
        hitArea: []
    },
    endTurn: {
        hitArea: []
    }
};

const buttons = {
    confirmCancel,
    done,
    launch,
    manufacturing,
    strategic,
    tactical,
    world
};

export {
    createButton,
    registerButtons,
    buttons
}