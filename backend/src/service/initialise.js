const gameService = require('./game');
const uuidv4 = require('uuid/v4');

const { ProvinceData, UnitData, StructureData } = require('shared');

const missions = require('./seeding/missions');
const campaigns = require('./seeding/campaigns');
const walls = require('./seeding/walls');
const roads = require('./seeding/roads');
const units = require('./seeding/units');
const structures = require('./seeding/structures');
const cash = require('./seeding/cash');

const createUnitInstance = (containerOwner, side) => {
    // The containerOwner is either the owner of the province or structure
    // that is holding the unit which is used by default if the unit itself
    // isn't owned by a particular person
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
        },
        'NEUTRAL': {
            'SQUAD': 'NGRV',
            'LTTANK': 'NATV',
            'TANK': 'NTNK',
            'LONGRANGE': 'NROC'
        }
    };
    return (result, object) => {
        let owner;
        if (object.owner === 'PLAYER') {
            owner = side;
        } else if (object.owner === 'OPPOSITE') {
            owner = gameService.opposite(side);
        } else {
            owner = containerOwner;
        }
        const ref = UnitData[unitLookup[owner][object.type]];
        const pos = object.position ? {
            "x": object.position.x,
            "y": object.position.y
        } : null;
        result[uuidv4()] = {
            "kind": ref.kind,
            "position": pos,
            "experience": object.experience,
            "hp": ref.hp,
            "owner": owner,
            "facing": 0
        };
        return result;
    }
}

const createStructureInstance = (containerOwner, side) => {
    const owner = containerOwner; // structures are always owned by the province owner
    const structureLookup = {
        'HUMAN': {
            "AIRPORT": "HAIR",
            "ANTIMISSILE": "HDEF",
            "BARRACKS": "HBAR",
            "DROPSHIP": "HSHP",
            "ENERGY": "HENY",
            "FACTORY": "HFAC",
            "LAB": "HLAB",
            "MINING": "HMIN",
            "MISSILE": "HSIL",
            "SCANNER": "HRAD",
            "STARPORT": "HBAY",
            "TOWER": "HTUR"
        },
        'ALIEN': {
            "AIRPORT": "AAIR",
            "ANTIMISSILE": "ADEF",
            "BARRACKS": "ABAR",
            "DROPSHIP": "ASHP",
            "ENERGY": "AENY",
            "FACTORY": "AFAC",
            "LAB": "ALAB",
            "MINING": "AMIN",
            "MISSILE": "ASIL",
            "SCANNER": "ARAD",
            "STARPORT": "ABAY",
            "TOWER": "ATUR"
        },
        'NEUTRAL': {
            "AIRPORT": "HAIR",
            "ANTIMISSILE": "HDEF",
            "BARRACKS": "HBAR",
            "DROPSHIP": "HSHP",
            "ENERGY": "HENY",
            "FACTORY": "HFAC",
            "LAB": "HLAB",
            "MINING": "HMIN",
            "MISSILE": "HSIL",
            "SCANNER": "HRAD",
            "STARPORT": "HBAY",
            "TOWER": "HTUR"
        },
    }[owner];
    return (result, object) => {
        const ref = StructureData[structureLookup[object.type]];
        const units = (object.units || []).reduce(createUnitInstance(owner, side), {});
        const pos = object.position ? {
            "x": object.position.x,
            "y": object.position.y
        } : null;
        result[uuidv4()] = {
            "hp": ref.hp,
            "kind": ref.kind,
            "units": units,
            "position": pos,
            "owner": owner,
        }
        return result;
    }
}

const addExtendedProvinceInformation = (key, side, province) => {
    province.mission = missions[key];
    province.walls = province.walls || walls[key] || [];
    province.roads = province.roads || roads[key] || [];
    province.units = (province.units || units[key] || []).reduce(createUnitInstance(province.owner, side), {});
    province.structures = (province.structures || structures[key] || []).reduce(createStructureInstance(province.owner, side), {});
    return province;
};

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
