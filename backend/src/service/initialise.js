const gameService = require('./game');
const uuidv4 = require('uuid/v4');

const campaigns = {
    startingProvinces: [
        'haven',
        'free-city'
    ],
    provinces: [
        // Fallen Haven
        ['cartasone', 'eagle-nest', 'haven', 'milos', 'high-point', 'ayden', 'snake-river', 'canuck', 'point-harbour', 'rock-castle', 'sparta', 'aberdeen', 'delos', 'norwood', 'kinabal', 'marshall', 'roanoke', 'creedmoor', 'garland', 'chaos'],
        // The last hope campaign
        ['free-city', 'lachine', 'sutton', 'rolland', 'chertsy', 'bromont', 'rawdon', 'granby', 'alma', 'brome-lake', 'hull', 'norenda', 'brimstone', 'thetfordmines', 'sherbrooke', 'masson-lake', 'kamouraska', 'esterel', 'valleyfield', 'orford', 'three-rivers']
    ]
}
module.exports.generateGame = (userId, name, race, difficulty, campaignType) => {
    const side = ['HUMAN', 'ALIEN'][race];
    const sides = {};
    sides[userId] = {
        "globalReserve": 4255,
        "name": name,
        "type": "PLAYER",
        "owner": side,
        "difficulty": difficulty,
        "technology": {
            "energy-efficiency": 0,
            "armour": 0,
            "speed": 0,
            "weapon-damage": 0,
            "rate-of-fire": 0,
            "rocketry": 0
        }
    };

    // generate AI opponent
    // the id should be generated each time to avoid having lots of 'players' with the same id
    const computerId = uuidv4();
    sides[computerId] = {
        "globalReserve": 8000,
        "name": "Computer",
        "type": "AI",
        "owner": gameService.opposite(side),
        "difficulty": difficulty,
        "technology": {
            "energy-efficiency": 0,
            "armour": 0,
            "speed": 0,
            "weapon-damage": 0,
            "rate-of-fire": 0,
            "rocketry": 0
        }
    };
    const game = {
        "id": uuidv4(),
        "turn": {
            "seed": Math.floor(Math.random() * Math.floor(2147483647)),
            "number": 1,
            "action": 0,
            "kind": "STRATEGIC", // or TACTICAL
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
                "walls": [{ "x": 18, "y": 5 }, { "x": 3, "y": 9 }],
                "roads": [{ "x": 7, "y": 5 }, { "x": 8, "y": 5 }, { "x": 9, "y": 5 }],
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
                "owner": gameService.opposite(side),
                "mission": null,
                "units": {},
                "structures": {}
            },
            "sutton": {
                "owner": gameService.opposite(side),
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