
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

        if (!resource) {
            this.game.scene.start('MainMenu');
            return;
        };

        if (resource === 'encyclopedia') {
            this.game.scene.start('Encyclopedia');
            return;
        }

        if (resource === 'games') {
            if (!id) {
                this.game.scene.start('NewGame');
            } else {
                this.game.scene.start('LoadGameResources', {
                    gameId: id,
                    colony: subresource,
                    view: view
                });
            }
            return;
        }

        console.error('Unable to match route from ' + JSON.stringify({
            resource, id, subresource, view
        }, null, 2));
    }
}