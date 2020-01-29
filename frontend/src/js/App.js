
import * as scenes from './scenes';

export class App {

    constructor(game) {
        this.game = game;
    }

    registerScenes() {
        this.game.scene.add('Encyclopedia', scenes.Encyclopedia);
        this.game.scene.add('LoadGameResources', scenes.LoadGameResources);
        this.game.scene.add('MainMenu', scenes.MainMenu);
        this.game.scene.add('NewGame', scenes.NewGame);
        this.game.scene.add('Play', scenes.Play);
        this.game.scene.add('StrategicView', scenes.StrategicView);
    }

    route(path, query) {
        const [_, resource, id, subresource] = path.split('/');
        const view = new URLSearchParams(query).get("view");

        // Stop any old scenes before starting the new one
        // this is required as we 'should' be calling scene.start(<key>)
        // from the current scene, not this.game - so we don't know which
        // is the current scene that requires being stopped
        this.game.scene.getScenes(true).forEach(scene => scene.scene.stop());

        if (!resource) {
            return this.game.scene.start('MainMenu');
        };

        if (resource === 'encyclopedia') {
            return this.game.scene.start('Encyclopedia');
        }

        if (resource === 'games') {
            if (!id) {
                return this.game.scene.start('NewGame');
            } else {
                return this.game.scene.start('LoadGameResources', {
                    gameId: id,
                    colony: subresource,
                    view: view
                });
            }
        }

        console.error('Unable to match route from ' + JSON.stringify({
            resource, id, subresource, view
        }, null, 2));
        return null;
    }
}