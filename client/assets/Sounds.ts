import Phaser from 'phaser';

import aargh from '../sounds/SOUNDS/AARGH.WAV';
import inout from '../sounds/SOUNDS/INOUT.WAV';
import road from '../sounds/SOUNDS/ROAD.WAV';
import telep from '../sounds/SOUNDS/TELEP.WAV';
import wbuild from '../sounds/SOUNDS/WBUILD.WAV';
import yessir from '../sounds/SOUNDS/YESSIR.WAV';

export class Sounds {
  preload(scene: Phaser.Scene): void {
    scene.load.audio('aargh', [aargh]);
    scene.load.audio('yessir', [yessir]);
    scene.load.audio('road', [road]);
    scene.load.audio('telep', [telep]);
    scene.load.audio('wbuild', [wbuild]);
    scene.load.audio('inout', [inout]);
  }
}
