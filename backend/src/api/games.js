const uuidv4 = require('uuid/v4');
const service = require('../service/game');

// TODO: these don't belong here - but it's quick and easy
const opposite = (side) => { return side === 'HUMAN' ? 'ALIEN' : 'HUMAN' };
const campaigns = {
    startingProvinces: [
        'haven',
        'free-city'
    ],
    provinces: [
        // Fallen Haven
        ['cartasone', 'eagle-nest', 'haven'],
        // The last hope campaign
        ['free-city', 'lachine', 'sutton']
    ]
}
const generateGame = (id, userId, race, difficulty, campaignType) => {
    const side = ['HUMAN', 'ALIEN'][race];
    const sides = {};
    sides[userId] = {
        "globalReserve": 4255,
        "type": "PLAYER",
        "owner": side,
        "difficulty": difficulty
    };

    // generate AI opponent
    const computerId = uuidv4();
    sides[computerId] = {
        "globalReserve": 8000,
        "type": "AI",
        "owner": opposite(side),
        "difficulty": difficulty
    };
    const game = {
        "id": id,
        "turn": {
            "seed": Math.floor(Math.random() * Math.floor(2147483647)),
            "number": 1,
            "owner": side // starts on your turn
        },
        "sides": sides,
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
            },
            "free-city": {
                "owner": side, // you only own this side
                "mission": null,
                "units": {},
                "structures": {}
            },
            "lachine": {
                "owner": opposite(side),
                "mission": null,
                "units": {},
                "structures": {}
            },
            "sutton": {
                "owner": opposite(side),
                "mission": null,
                "units": {},
                "structures": {}
            }
        }
    };

    // We generate the starting information for both campaign types
    // then filter the data we save to the backend for simplicity
    const campaign = campaigns.provinces[campaignType];
    game.defaultProvince = campaigns.startingProvinces[campaignType];
    game.provinces = Object.keys(game.provinces)
        .filter(province => campaign.includes(province))
        .reduce((provinces, province) => {
            provinces[province] = game.provinces[province];
            return provinces;
        }, {});
    return game;
};

const requireUser = (req, res, next) => {
    const token = (req.headers.authorization || "").split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'No user found' });
    }

    req.user = Buffer.from(token, 'base64').toString('ascii');
    next();
}

module.exports.register = (app, redis) => {

    // GET /games/:id
    // Read game
    app.get('/games/:id', requireUser, (req, res) => {
        service.findByIdAndUser(redis, req.params.id, req.user)
            .then((game) => {
                res.status(200).json(game);
            })
            .catch((error) => {
                res.status(404).json({ error: error.message });
            });
    });

    // POST /games
    // Create game
    app.post('/games', requireUser, (req, res) => {
        // generate a unique id
        const gameId = uuidv4();
        const game = generateGame(gameId, req.user, req.body.race, req.body.difficulty, req.body.campaign);
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