const structures = {
    neutral: require('../../images/structures/neut_si.png'),
    neutral_dropship: require('../../images/structures/neut_ssi.png'),
    alien: require('../../images/structures/alie_si.png'),
    alien_dropship: require('../../images/structures/alie_ssi.png'),
    human: require('../../images/structures/huma_si.png'),
    human_dropship: require('../../images/structures/huma_ssi.png'),
    infra: require('../../images/structures/infra.png'),
}

const units = {
    alien: require('../../images/units/alie_ui.png'),
    human: require('../../images/units/alie_ui.png'),
    neutral: require('../../images/units/alie_ui.png')
}

export const registerStructures = (scene) => {
    scene.load.spritesheet('structure-neutral', structures.neutral, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('structure-neutral-dropship', structures.neutral_dropship, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('structure-alien', structures.alien, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('structure-alien-dropship', structures.alien_dropship, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('structure-human', structures.human, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('structure-human-dropship', structures.human_dropship, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('structure-infra', structures.infra, { frameWidth: 70, frameHeight: 54 });
}

export const registerUnits = (scene) => {
    scene.load.spritesheet('unit-alien', units.alien, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('unit-human', units.human, { frameWidth: 70, frameHeight: 54 });
    scene.load.spritesheet('unit-neutral', units.neutral, { frameWidth: 70, frameHeight: 54 });
}

/*
Example Animation

import imp from '../../images/anim/imp.png';
this.load.spritesheet('imp', imp, { frameWidth: 32, frameHeight: 32 });
var config = {
    key: 'imp-anim',
    frames: this.anims.generateFrameNumbers('imp'),
    frameRate: 12,
    repeat: -1
};
this.anims.create(config);
this.add.sprite(100, 100, 'imp').play('imp-anim');
*/