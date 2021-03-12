const gameService = require('../service/game');
const information = require('../service/information');
const initialise = require('../service/initialise');
const auth = require('./auth');

module.exports.register = ({ express, redis, socketio }) => {

    // GET /games/:id
    // Read game
    express.get('/games/:id', auth.requireUser, (req, res) => {
        gameService.findByIdAndUser(redis, req.params.id, req.user)
            .then((game) => {
                return information.removeUnknown(game, req.user);
            })
            .then((game) => {
                res.status(200).json(game);
            })
            .catch((error) => {
                res.status(404).json({ error: error.message });
            });
    });

    // GET /games
    // Find in-progress games
    express.get('/games', auth.requireUser, (req, res) => {
        gameService.findAllByUser(redis, req.user)
            .then((games) => {
                res.status(200).json(games);
            })
            .catch((error) => {
                res.status(404).json({ error: error.message });
            });
    });

    // POST /games
    // Create game
    express.post('/games', auth.requireUser, (req, res) => {
        const game = initialise.generateGame(req.user, req.body.name, req.body.race, req.body.difficulty, req.body.campaign);
        // save game to database
        gameService.create(redis, game, req.user)
            .then((id) => {
                res.status(201).json({ id });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            })
    });

    // POST /games/:id/action
    // Performs a serialised action without ending your turn
    express.post('/games/:id/action', auth.requireUser, (req, res) => {
        // TODO: this needs to actually apply the changes to the game and return
        res.status(201).json({ id: req.params.id });
    });

    // POST /games/:id/turn
    // Ends your current turn and ensures validating all actions have been sent
    express.post('/games/:id/turn', auth.requireUser, (req, res) => {
        gameService.findByIdAndUser(redis, req.params.id, req.user)
            .then((game) => {
                // perform some validation to ensure user has submitted all moves for this turn
                if (game.sides[req.user].owner !== game.turn.owner) {
                    throw new Error('Not your turn');
                }
                if (req.body.turn !== game.turn.number) {
                    throw new Error('Turn is not correct');
                }
                if (req.body.action !== game.turn.action) {
                    if (!req.body.actions) {
                        throw new Error('Not all actions have been submitted');
                    }
                    if (game.turn.action + req.body.actions.length !== req.body.action) {
                        throw new Error('Not all actions have been submitted while ending turn');
                    }
                }
                return game;
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            })
            .then((game) => {
                // update game
                gameService.nextTurn(game);
                gameService.save(redis, game);

                res.status(201).json({ id: game.id, turn: game.turn.number });
            })
            .catch((error) => {
                res.status(404).json({ error: error.message });
            });
    });

    socketio.on("connection", socket => {
        const joinGame = (gameId) => {
            console.log('socket ' + socket.id + ' joined ' + gameId);
            socket.join(gameId);
        }

        const leaveGame = (gameId) => {
            console.log('socket ' + socket.id + ' left ' + gameId);
            socket.leave(gameId);
        }

        console.log('client connected');
        socket.on("game:join", joinGame);
        socket.on("game:leave", leaveGame);
    });

    socketio.on("disconnect", reason => {
        console.log('client disconnected');
    });
}
