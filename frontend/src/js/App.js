
import * as scenes from './scenes';
import { CommandQueue, SocketController } from './components';

export class App {

    constructor(game) {
        this.game = game;
    }

    initialise() {
        // prepare scenes
        Object.keys(scenes).forEach(key => {
            this.game.scene.add(key, scenes[key]);
        });
        this.game.commandQueue = new CommandQueue();
        this.game.socketController = new SocketController();
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
            return this.game.scene.start('Encyclopedia', { category: id, item: subresource });
        }

        if (resource === 'games') {
            if (!id) {
                return this.game.scene.start('ListGames');
            } else if (id === 'new') {
                return this.game.scene.start('NewGame');
            } else {
                return this.game.scene.start('LoadGameResources', {
                    gameId: id,
                    province: subresource,
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