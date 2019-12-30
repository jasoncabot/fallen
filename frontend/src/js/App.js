
import MainMenu from './scenes/MainMenu';
import StrategicView from './scenes/StrategicView';
import NewGame from './scenes/NewGame';
import Play from './scenes/Play';

export class App {

    registerScenes(game) {
        game.scene.add('MainMenu', MainMenu, true);
        game.scene.add('StrategicView', StrategicView);
        game.scene.add('NewGame', NewGame);
        game.scene.add('Play', Play);
    }
}