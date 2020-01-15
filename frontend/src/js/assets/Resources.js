export const Structures = {
    neutral: {
        ssi: require('../../images/structures/neut_ssi.png'),
        si: require('../../images/structures/neut_ssi.png')
    },
    alien: {
        ssi: require('../../images/structures/alie_ssi.png'),
        si: require('../../images/structures/alie_ssi.png')
    },
    human: {
        ssi: require('../../images/structures/huma_ssi.png'),
        si: require('../../images/structures/huma_ssi.png')
    }
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