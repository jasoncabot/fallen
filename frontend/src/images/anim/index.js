import cat from './cat.png';
import dgs from './dgs.png';
import dmp from './dmp.png';
import dms from './dms.png';
import dps from './dps.png';
import imp from './imp.png';
import impmeg from './impmeg.png';
import impmiss from './impmiss.png';
import kry from './kry.png';
import mmp from './mmp.png';
import nuke from './nuke.png';
import pow from './pow.png';
import rad from './rad.png';
import sbi from './sbi.png';
import x1b from './x1b.png';
import x1s from './x1s.png';
import xas from './xas.png';
import xhs from './xhs.png';

export const preloadAnimation = (scene, key) => {
    const lookup = {
        'cat': cat,
        'dgs': dgs,
        'dmp': dmp,
        'dms': dms,
        'dps': dps,
        'imp': imp,
        'impmeg': impmeg,
        'impmiss': impmiss,
        'kry': kry,
        'mmp': mmp,
        'nuke': nuke,
        'pow': pow,
        'rad': rad,
        'sbi': sbi,
        'x1b': x1b,
        'x1s': x1s,
        'xas': xas,
        'xhs': xhs
    };

    const defaultAnimationKey = `${key}-anim`;
    scene.load.spritesheet(key, lookup[key], { frameWidth: 32, frameHeight: 32 });
    var config = {
        key: defaultAnimationKey,
        frames: scene.anims.generateFrameNumbers(key),
        frameRate: 12,
        repeat: -1
    };
    scene.anims.create(config);
    return defaultAnimationKey;
};