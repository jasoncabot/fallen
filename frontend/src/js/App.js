
import * as scenes from './scenes';

export class App {

    registerScenes(game) {
        game.scene.add('Encyclopedia', scenes.Encyclopedia);
        game.scene.add('LoadGameResources', scenes.LoadGameResources);
        game.scene.add('MainMenu', scenes.MainMenu, true);
        game.scene.add('NewGame', scenes.NewGame);
        game.scene.add('Play', scenes.Play);
        game.scene.add('StrategicView', scenes.StrategicView);
    }
}