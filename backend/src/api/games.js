const uuidv4 = require('uuid/v4');
const service = require('../service/game');

const generateGame = (id, race, difficulty, campaign) => {
    // TODO: difficulty should change the AI
    // campaign should change the set of terrains
    const side = ['HUMAN', 'ALIEN'][race];
    return {
        "id": id,
        "turn": {
            "seed": Math.floor(Math.random() * Math.floor(2147483647)),
            "number": 1,
            "owner": side // starts on your turn
        },
        "globalReserve": 4255,
        "provinces": {
            "cartasone": {
                "owner": "NEUTRAL",
                "mission": null,
                "units": {},
                "structures": {}
            },
            "eagle-nest": {
                "owner": "NEUTRAL",
                "mission": {
                    "description": "Rebels need help",
                    "objective": "Destroy Rocket Launcher",
                    "reward": "Rebel forces will join you",
                },
                "units": {},
                "structures": {}
            },
            "haven": {
                "owner": side, // always own haven
                "mission": null,
                "energy": 123,
                "credits": 1421,
                "research": 1234,
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
        const game = generateGame(gameId, req.body.race, req.body.difficulty, req.body.campaign);
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