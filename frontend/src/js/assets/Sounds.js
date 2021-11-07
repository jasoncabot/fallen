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

const preloadSounds = (scene, sounds) => {

    const lookup = {
        'impact2': [impact2],
        'aargh': [aargh],
        'cbuild': [cbuild],
        'crysfire': [crysfire],
        'destcash': [destcash],
        'error': [error],
        'explb': [explb],
        'expmb': [expmb],
        'expnuk': [expnuk],
        'expsb': [expsb],
        'expsqua': [expsqua],
        'expsquh': [expsquh],
        'expvehic': [expvehic],
        'impact1': [impact1],
        'impact3': [impact3],
        'impact4': [impact4],
        'impact5': [impact5],
        'impact6': [impact6],
        'impact7': [impact7],
        'impact8': [impact8],
        'inout': [inout],
        'land': [land],
        'megfire': [megfire],
        'megimp': [megimp],
        'movehov': [movehov],
        'movesq': [movesq],
        'movetrk': [movetrk],
        'movewhee': [movewhee],
        'nocash': [nocash],
        'nosound': [nosound],
        'popup': [popup],
        'repair': [repair],
        'road': [road],
        'shot01': [shot01],
        'shot02': [shot02],
        'shot03': [shot03],
        'shot04': [shot04],
        'shot05': [shot05],
        'shot06': [shot06],
        'shot07': [shot07],
        'shot08': [shot08],
        'shot09': [shot09],
        'shot10': [shot10],
        'shot11': [shot11],
        'silence': [silence],
        'telep': [telep],
        'wbuild': [wbuild],
        'yessir': [yessir]
    };

    sounds.forEach((sound) => scene.load.audio(sound, lookup[sound]));
};

export { preloadSounds };
