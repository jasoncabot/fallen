const uuidv4 = require('uuid/v4');
const service = require('../service/game');

const generateGame = (id) => {
    return {
        "id": id,
        "globalReserve": 4255,
        "haven": {
            "energy": 123,
            "research": 1234,
            "income": 1421,
            "units": {
                "123456": {
                    "kind": {
                        "category": "ASQD"
                    },
                    "facing": 0,
                    "position": { "x": 3, "y": 5 },
                    "hp": 15,
                    "experience": 1
                }
            },
            "structures": {
                "23456": {
                    "position": { "x": 0, "y": 0 },
                    "hp": 15,
                    "kind": {
                        "category": "ASHP"
                    }
                },
                "34567": {
                    "position": { "x": 3, "y": 0 },
                    "hp": 200,
                    "kind": {
                        "category": "AAIR"
                    }
                }
            }
        }
    };
};

module.exports.register = (app, redis) => {

    // GET /games/:id
    // Read game
    app.get('/games/:id', (req, res) => {
        service.findById(redis, req.params.id)
            .then((game) => {
                res.status(200).json(game);
            })
            .catch((error) => {
                res.status(404).json({ error: error.message });
            });
    });

    // POST /games
    // Create game
    app.post('/games', (req, res) => {
        // generate a unique id
        const gameId = uuidv4();
        const game = generateGame(gameId);
        console.log('starting game with options: ' + req.body.race);
        console.log('starting game with options: ' + req.body.difficulty);
        console.log('starting game with options: ' + req.body.campaign);
        // save game to database
        service.create(redis, gameId, game)
            .then(() => {
                res.status(201).json({ id: gameId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            })
    });
}