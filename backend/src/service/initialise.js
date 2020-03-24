const gameService = require('./game');
const uuidv4 = require('uuid/v4');

const { UnitData, StructureData } = require('shared');

const campaigns = {
    startingProvinces: [
        'haven',
        'free-city'
    ],
    provinces: [
        // Fallen Haven
        ['cartasone', 'eagle-nest', 'haven', 'milos', 'high-point', 'ayden', 'snake-river', 'canuck', 'point-harbour', 'rock-castle', 'sparta', 'aberdeen', 'delos', 'elkin', 'norwood', 'kinabal', 'marshall', 'roanoke', 'creedmoor', 'garland', 'chaos'],
        // The last hope campaign
        ['free-city', 'lachine', 'sutton', 'rolland', 'chertsy', 'bromont', 'rawdon', 'granby', 'alma', 'brome-lake', 'hull', 'norenda', 'brimstone', 'thetfordmines', 'sherbrooke', 'masson-lake', 'kamouraska', 'esterel', 'valleyfield', 'orford', 'three-rivers']
    ]
};

const missions = {
    "eagle-nest": {
        "description": "Rebels need help",
        "objective": "Destroy Rocket Launcher",
        "reward": "Rebel forces will join you",
    },
    "milos": {
        "description": "Annihilate their research capacity",
        "objective": "Destroy the Laboratory",
        "reward": "5000 R. Pts",
    },
    'canuck': {
        "description": "Special units under attack by the enemy",
        "objective": "Destroy all enemy units",
        "reward": "Special units",
    },
    "kinabal": {
        "description": "",
        "objective": "Destroy all the enemy units without destroying a single building",
        "reward": "5000 Cr.",
    }
};

const walls = {
    "haven": [
        { "x": 31, "y": 16 },
        { "x": 31, "y": 17 },
        { "x": 31, "y": 18 },
        { "x": 29, "y": 19 },
        { "x": 30, "y": 19 },
        { "x": 31, "y": 19 }
    ]
}

const roads = {
    "haven": [
        { "x": 18, "y": 18 },
        { "x": 17, "y": 19 },
        { "x": 18, "y": 19 },
        { "x": 18, "y": 20 },
        { "x": 19, "y": 20 },
        { "x": 20, "y": 20 },
        { "x": 21, "y": 20 },
        { "x": 25, "y": 20 },
        { "x": 26, "y": 20 },
        { "x": 21, "y": 21 },
        { "x": 25, "y": 21 },
        { "x": 26, "y": 21 },
        { "x": 30, "y": 21 },
        { "x": 31, "y": 21 },
        { "x": 32, "y": 21 },
        { "x": 21, "y": 22 },
        { "x": 25, "y": 22 },
        { "x": 26, "y": 22 },
        { "x": 27, "y": 22 },
        { "x": 28, "y": 22 },
        { "x": 29, "y": 22 },
        { "x": 30, "y": 22 },
        { "x": 21, "y": 23 },
        { "x": 22, "y": 23 },
        { "x": 23, "y": 23 },
        { "x": 24, "y": 23 },
        { "x": 25, "y": 23 },
        { "x": 26, "y": 23 },
        { "x": 30, "y": 23 },
        { "x": 22, "y": 24 },
        { "x": 23, "y": 24 },
        { "x": 24, "y": 24 },
        { "x": 25, "y": 24 },
        { "x": 30, "y": 24 },
        { "x": 22, "y": 25 },
        { "x": 23, "y": 25 },
        { "x": 24, "y": 25 },
        { "x": 25, "y": 25 },
        { "x": 30, "y": 25 },
        { "x": 18, "y": 26 },
        { "x": 19, "y": 26 },
        { "x": 20, "y": 26 },
        { "x": 21, "y": 26 },
        { "x": 22, "y": 26 },
        { "x": 23, "y": 26 },
        { "x": 24, "y": 26 },
        { "x": 25, "y": 26 },
        { "x": 30, "y": 26 },
        { "x": 22, "y": 27 },
        { "x": 30, "y": 27 },
        { "x": 22, "y": 28 },
        { "x": 30, "y": 28 },
        { "x": 22, "y": 29 },
        { "x": 30, "y": 29 },
        { "x": 22, "y": 30 },
        { "x": 30, "y": 30 },
        { "x": 22, "y": 31 },
        { "x": 22, "y": 32 },
        { "x": 17, "y": 18 }
    ]
}

// TODO: structures should not just be ALIEN - it should be generic and looked up based on side - see how units work

const units = {
    "haven": [
        { "type": "SQUAD", "position": { "x": 25, "y": 20 }, "experience": 1 },
        { "type": "SQUAD", "position": { "x": 22, "y": 27 }, "experience": 1 },
        { "type": "SQUAD", "position": { "x": 18, "y": 19 }, "experience": 1 },
        { "type": "LTTANK", "position": { "x": 26, "y": 32 }, "experience": 1 },
        { "type": "TROOP", "position": { "x": 30, "y": 29 }, "experience": 1 },
        { "type": "TROOP", "position": { "x": 26, "y": 20 }, "experience": 1 },
        { "type": "LTTANK", "position": { "x": 30, "y": 22 }, "experience": 1 },
        { "type": "LTTANK", "position": { "x": 30, "y": 26 }, "experience": 1 }
    ]
};

const structures = {
    "haven": [
        { "position": { "x": 20, "y": 24 }, "kind": "AENY" },
        { "position": { "x": 20, "y": 27 }, "kind": "AENY" },
        { "position": { "x": 18, "y": 24 }, "kind": "AENY" },
        { "position": { "x": 18, "y": 27 }, "kind": "AENY" },
        { "position": { "x": 27, "y": 23 }, "kind": "AMIN" },
        { "position": { "x": 18, "y": 21 }, "kind": "AMIN" },
        { "position": { "x": 28, "y": 19 }, "kind": "ATUR" },
        { "position": { "x": 27, "y": 20 }, "kind": "ABAR" },
        { "position": { "x": 22, "y": 20 }, "kind": "AFAC" },
        { "position": { "x": 31, "y": 22 }, "kind": "AAIR" },
        { "position": { "x": 23, "y": 29 }, "kind": "ALAB" },
        { "position": { "x": 23, "y": 31 }, "kind": "ALAB" },
        { "position": { "x": 24, "y": 27 }, "kind": "ARAD" },
        {
            "position": { "x": 23, "y": 24 },
            "kind": "ASHP",
            "units": [
                { "type": "TROOP", "experience": 1 },
                { "type": "SQUAD", "experience": 1 },
                { "type": "LTTANK", "experience": 1 },
            ]
        },
        { "position": { "x": 27, "y": 27 }, "kind": "ABAY" }
    ]
};

const createUnitInstance = (side) => {
    const unitLookup = {
        'HUMAN': {
            "SQUAD": "HSQU",
            "TROOP": "HRAN",
            "LTTANK": "HATV",
            "LONGRANGE": "HART",
            "UNIQUE1": "HBUG",
            "TANK": "HTNK",
            "LTGRAV": "HSPE",
            "HEAVYGRAV": "HGRV",
            "LONGRANGEHOVER": "HGUN"
        },
        'ALIEN': {
            "SQUAD": "ASQD",
            "TROOP": "ASNI",
            "LTTANK": "ALTK",
            "LONGRANGE": "APLA",
            "HEAVYGRAV": "AGRV",
            "LTGRAV": "AFLY",
            "TANK": "AMDT",
            "LONGRANGEHOVER": "ASUP",
            "UNIQUE1": "AMEG"
        }
    }[side];
    return (result, object) => {
        const ref = UnitData[unitLookup[object.type]];
        const pos = object.position ? {
            "x": object.position.x,
            "y": object.position.y
        } : null;
        result[uuidv4()] = {
            "kind": ref.kind,
            "position": pos,
            "experience": object.experience,
            "hp": ref.hp,
            "facing": 0
        };
        return result;
    }
}

const createStructureInstance = (side) => {
    return (result, object) => {
        const ref = StructureData[object.kind];
        const units = (object.units || []).reduce(createUnitInstance(side), {});
        const pos = object.position ? {
            "x": object.position.x,
            "y": object.position.y
        } : null;
        result[uuidv4()] = {
            "hp": ref.hp,
            "kind": ref.kind,
            "units": units,
            "position": pos,
        }
        return result;
    }
}

const addExtendedProvinceInformation = (key, side, province) => {
    province.mission = missions[key];
    province.walls = province.walls || walls[key] || [];
    province.roads = province.roads || roads[key] || [];
    province.units = (province.units || units[key] || []).reduce(createUnitInstance(side), {});
    province.structures = (province.structures || structures[key] || []).reduce(createStructureInstance(side), {});
    // TODO: this should look at the structures and units to decide sensible values
    province.energy = 123;
    province.credits = 123;
    province.research = 123;
    return province;
};

const cash = [4000, 6000, 8000];

module.exports.generateGame = (userId, name, race, difficulty, campaignType) => {
    const side = ['HUMAN', 'ALIEN'][race];
    const sides = {};
    sides[userId] = {
        "globalReserve": cash[difficulty],
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
        "globalReserve": cash[2 - difficulty],
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
            "cartasone": { "owner": "NEUTRAL" },
            "eagle-nest": { "owner": "NEUTRAL" },
            "haven": { "owner": side, "capital": side /* always own haven */ },
            "free-city": { "owner": side, "capital": side /* you only own this side */ },
            "lachine": { "owner": gameService.opposite(side) },
            "sutton": { "owner": gameService.opposite(side) },
            "milos": { "owner": "NEUTRAL" },
            "high-point": { "owner": "NEUTRAL" },
            "ayden": { "owner": "NEUTRAL" },
            "snake-river": { "owner": "NEUTRAL" },
            "canuck": { "owner": "NEUTRAL" },
            "point-harbour": { "owner": "NEUTRAL" },
            "rock-castle": { "owner": "NEUTRAL" },
            "sparta": { "owner": "NEUTRAL" },
            "aberdeen": { "owner": "NEUTRAL" },
            "delos": { "owner": "NEUTRAL" },
            "elkin": { "owner": "NEUTRAL" },
            "norwood": { "owner": "NEUTRAL" },
            "kinabal": { "owner": "NEUTRAL" },
            "marshall": { "owner": "NEUTRAL" },
            "roanoke": { "owner": "NEUTRAL" },
            "creedmoor": { "owner": "NEUTRAL" },
            "garland": { "owner": "NEUTRAL" },
            "chaos": { "owner": gameService.opposite(side), "capital": gameService.opposite(side) },
            "rolland": { "owner": gameService.opposite(side) },
            "chertsy": { "owner": gameService.opposite(side) },
            "bromont": { "owner": gameService.opposite(side) },
            "rawdon": { "owner": gameService.opposite(side) },
            "granby": { "owner": gameService.opposite(side) },
            "alma": { "owner": gameService.opposite(side) },
            "brome-lake": { "owner": gameService.opposite(side) },
            "hull": { "owner": gameService.opposite(side) },
            "norenda": { "owner": gameService.opposite(side) },
            "brimstone": { "owner": gameService.opposite(side), "capital": gameService.opposite(side) },
            "thetfordmines": { "owner": gameService.opposite(side) },
            "sherbrooke": { "owner": gameService.opposite(side) },
            "masson-lake": { "owner": gameService.opposite(side) },
            "kamouraska": { "owner": gameService.opposite(side) },
            "esterel": { "owner": gameService.opposite(side) },
            "valleyfield": { "owner": gameService.opposite(side) },
            "orford": { "owner": gameService.opposite(side) },
            "three-rivers": { "owner": gameService.opposite(side) }
        }
    };

    // We generate the starting information for both campaign types
    // then filter the data we save to the backend for simplicity
    const campaign = campaigns.provinces[campaignType];
    game.defaultProvince = campaigns.startingProvinces[campaignType];
    game.provinces = Object.keys(game.provinces)
        .filter(province => campaign.includes(province))
        .reduce((provinces, province) => {
            let data = game.provinces[province];
            provinces[province] = addExtendedProvinceInformation(province, side, data);
            return provinces;
        }, {})
    return game;
};
