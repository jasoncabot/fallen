import Phaser from 'phaser';
import alieSi from '../images/structures/alie_si.png';
import alieSsi from '../images/structures/alie_ssi.png';
import humaSi from '../images/structures/huma_si.png';
import humaSsi from '../images/structures/huma_ssi.png';
import neutSi from '../images/structures/neut_si.png';
import neutSsi from '../images/structures/neut_ssi.png';
import infra from '../images/structures/infra.png';

import alieUi from '../images/units/alie_ui.png';
import humaUi from '../images/units/huma_ui.png';
import neutUi from '../images/units/neut_ui.png';

export const registerStructures = (scene: Phaser.Scene): void => {
  scene.load.spritesheet('structure-neutral', neutSi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('structure-neutral-dropship', neutSsi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('structure-alien', alieSi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('structure-alien-dropship', alieSsi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('structure-human', humaSi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('structure-human-dropship', humaSsi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('structure-infra', infra, { frameWidth: 70, frameHeight: 54 });
};

export const registerUnits = (scene: Phaser.Scene): void => {
  scene.load.spritesheet('unit-alien', alieUi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('unit-human', humaUi, { frameWidth: 70, frameHeight: 54 });
  scene.load.spritesheet('unit-neutral', neutUi, { frameWidth: 70, frameHeight: 54 });
};
