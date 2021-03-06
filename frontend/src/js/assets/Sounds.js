import impact2 from '../../sounds/SOUNDS/IMPACT2.WAV';
import aargh from '../../sounds/SOUNDS/AARGH.WAV';
import cbuild from '../../sounds/SOUNDS/CBUILD.WAV';
import crysfire from '../../sounds/SOUNDS/CRYSFIRE.WAV';
import destcash from '../../sounds/SOUNDS/DESTCASH.WAV';
import error from '../../sounds/SOUNDS/ERROR.WAV';
import explb from '../../sounds/SOUNDS/EXPLB.WAV';
import expmb from '../../sounds/SOUNDS/EXPMB.WAV';
import expnuk from '../../sounds/SOUNDS/EXPNUK.WAV';
import expsb from '../../sounds/SOUNDS/EXPSB.WAV';
import expsqua from '../../sounds/SOUNDS/EXPSQUA.WAV';
import expsquh from '../../sounds/SOUNDS/EXPSQUH.WAV';
import expvehic from '../../sounds/SOUNDS/EXPVEHIC.WAV';
import impact1 from '../../sounds/SOUNDS/IMPACT1.WAV';
import impact3 from '../../sounds/SOUNDS/IMPACT3.WAV';
import impact4 from '../../sounds/SOUNDS/IMPACT4.WAV';
import impact5 from '../../sounds/SOUNDS/IMPACT5.WAV';
import impact6 from '../../sounds/SOUNDS/IMPACT6.WAV';
import impact7 from '../../sounds/SOUNDS/IMPACT7.WAV';
import impact8 from '../../sounds/SOUNDS/IMPACT8.WAV';
import inout from '../../sounds/SOUNDS/INOUT.WAV';
import land from '../../sounds/SOUNDS/LAND.WAV';
import megfire from '../../sounds/SOUNDS/MEGFIRE.WAV';
import megimp from '../../sounds/SOUNDS/MEGIMP.WAV';
import movehov from '../../sounds/SOUNDS/MOVEHOV.WAV';
import movesq from '../../sounds/SOUNDS/MOVESQ.WAV';
import movetrk from '../../sounds/SOUNDS/MOVETRK.WAV';
import movewhee from '../../sounds/SOUNDS/MOVEWHEE.WAV';
import nocash from '../../sounds/SOUNDS/NOCASH.WAV';
import nosound from '../../sounds/SOUNDS/NOSOUND.WAV';
import popup from '../../sounds/SOUNDS/POPUP.WAV';
import repair from '../../sounds/SOUNDS/REPAIR.WAV';
import road from '../../sounds/SOUNDS/ROAD.WAV';
import shot01 from '../../sounds/SOUNDS/SHOT01.WAV';
import shot02 from '../../sounds/SOUNDS/SHOT02.WAV';
import shot03 from '../../sounds/SOUNDS/SHOT03.WAV';
import shot04 from '../../sounds/SOUNDS/SHOT04.WAV';
import shot05 from '../../sounds/SOUNDS/SHOT05.WAV';
import shot06 from '../../sounds/SOUNDS/SHOT06.WAV';
import shot07 from '../../sounds/SOUNDS/SHOT07.WAV';
import shot08 from '../../sounds/SOUNDS/SHOT08.WAV';
import shot09 from '../../sounds/SOUNDS/SHOT09.WAV';
import shot10 from '../../sounds/SOUNDS/SHOT10.WAV';
import shot11 from '../../sounds/SOUNDS/SHOT11.WAV';
import silence from '../../sounds/SOUNDS/SILENCE.WAV';
import telep from '../../sounds/SOUNDS/TELEP.WAV';
import wbuild from '../../sounds/SOUNDS/WBUILD.WAV';
import yessir from '../../sounds/SOUNDS/YESSIR.WAV';

export class Sounds {
    preload(scene) {
        scene.load.audio('aargh', [aargh]);
        scene.load.audio('yessir', [yessir]);
        scene.load.audio('road', [road]);
        scene.load.audio('telep', [telep]);
        scene.load.audio('wbuild', [wbuild]);
        scene.load.audio('inout', [inout]);
    }
}