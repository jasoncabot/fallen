import {
    GameDetails,
    opposite,
    ProvinceData,
    ProvinceDetails,
    ProvinceID,
    ProvinceOverview,
    Side,
    SideDetails,
    SideType,
    StructureData,
    StructureDetails,
    StructureID,
    TurnKind,
    UnitData,
    UnitDetails,
    UnitID,
} from "shared";
import { UserID } from "../index.interface";


const { v4: uuidv4 } = require('uuid');

const missions = require('./seeding/missions');
const campaigns = require('./seeding/campaigns');
const walls = require('./seeding/walls');
const roads = require('./seeding/roads');
const units = require('./seeding/units');
const structures = require('./seeding/structures');
const cash = require('./seeding/cash');

const createUnitInstance = (containerOwner: Side, side: Side) => {
    // The containerOwner is either the owner of the province or structure
    // that is holding the unit which is used by default if the unit itself
    // isn't owned by a particular person
    const unitLookup: Record<Side, Record<string, string>> = {
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
    return (result: Record<UnitID, UnitDetails>, object: UnitData) => {
        let owner: Side;
        if (object.owner === 'PLAYER') {
            owner = side;
        } else if (object.owner === 'OPPOSITE') {
            owner = opposite(side);
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

const createStructureInstance = (containerOwner: Side, side: Side) => {
    const owner = containerOwner; // structures are always owned by the province owner
    const structureLookup: Record<Side, Record<string, string>> = {
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
    };
    return (result: Record<StructureID, StructureDetails>, object: StructureData) => {
        const ref = StructureData[structureLookup[owner][object.type]];
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

const addExtendedProvinceInformation = (key: string, side: Side, province: ProvinceData) => {
    province.mission = missions[key];
    province.walls = province.walls || walls[key] || [];
    province.roads = province.roads || roads[key] || [];
    province.units = (province.units || units[key] || []).reduce(createUnitInstance(province.owner, side), {});
    province.structures = (province.structures || structures[key] || []).reduce(createStructureInstance(province.owner, side), {});
    return province as ProvinceDetails;
};

const generateGame = (userId: string, name: string, race: number, difficulty: number, campaignType: number) => {
    const side: Side = [Side.Human, Side.Alien][race];
    const sides: Record<UserID, SideDetails> = {};
    sides[userId] = {
        "globalReserve": cash[difficulty],
        "name": name,
        "type": SideType.Human,
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
    } as SideDetails;

    // generate AI opponent
    // the id should be generated each time to avoid having lots of 'players' with the same id
    const computerId = uuidv4();
    sides[computerId] = {
        globalReserve: cash[2 - difficulty],
        name: "Computer",
        type: SideType.AI,
        owner: opposite(side),
        difficulty: difficulty,
        technology: {
            "energy-efficiency": 0,
            "armour": 0,
            "speed": 0,
            "weapon-damage": 0,
            "rate-of-fire": 0,
            "rocketry": 0
        }
    } as SideDetails;

    const provinces: Record<ProvinceID, ProvinceOverview> = {
        "cartasone": { "owner": Side.Neutral, "name": ProvinceData['cartasone'].name },
        "eagle-nest": { "owner": Side.Neutral, "name": ProvinceData['eagle-nest'].name },
        "haven": { "owner": side, "capital": side /* always own haven */, "name": ProvinceData['haven'].name },
        "free-city": { "owner": side, "capital": side /* you only own this side */, "name": ProvinceData['free-city'].name },
        "lachine": { "owner": opposite(side), "name": ProvinceData['lachine'].name },
        "sutton": { "owner": opposite(side), "name": ProvinceData['sutton'].name },
        "milos": { "owner": Side.Neutral, "name": ProvinceData['milos'].name },
        "high-point": { "owner": Side.Neutral, "name": ProvinceData['high-point'].name },
        "ayden": { "owner": Side.Neutral, "name": ProvinceData['ayden'].name },
        "snake-river": { "owner": Side.Neutral, "name": ProvinceData['snake-river'].name },
        "canuck": { "owner": Side.Neutral, "name": ProvinceData['canuck'].name },
        "point-harbour": { "owner": Side.Neutral, "name": ProvinceData['point-harbour'].name },
        "rock-castle": { "owner": Side.Neutral, "name": ProvinceData['rock-castle'].name },
        "sparta": { "owner": Side.Neutral, "name": ProvinceData['sparta'].name },
        "aberdeen": { "owner": Side.Neutral, "name": ProvinceData['aberdeen'].name },
        "delos": { "owner": Side.Neutral, "name": ProvinceData['delos'].name },
        "elkin": { "owner": Side.Neutral, "name": ProvinceData['elkin'].name },
        "norwood": { "owner": Side.Neutral, "name": ProvinceData['norwood'].name },
        "kinabal": { "owner": Side.Neutral, "name": ProvinceData['kinabal'].name },
        "marshall": { "owner": Side.Neutral, "name": ProvinceData['marshall'].name },
        "roanoke": { "owner": Side.Neutral, "name": ProvinceData['roanoke'].name },
        "creedmoor": { "owner": Side.Neutral, "name": ProvinceData['creedmoor'].name },
        "garland": { "owner": Side.Neutral, "name": ProvinceData['garland'].name },
        "chaos": { "owner": opposite(side), "capital": opposite(side), "name": ProvinceData['chaos'].name },
        "rolland": { "owner": opposite(side), "name": ProvinceData['rolland'].name },
        "chertsy": { "owner": opposite(side), "name": ProvinceData['chertsy'].name },
        "bromont": { "owner": opposite(side), "name": ProvinceData['bromont'].name },
        "rawdon": { "owner": opposite(side), "name": ProvinceData['rawdon'].name },
        "granby": { "owner": opposite(side), "name": ProvinceData['granby'].name },
        "alma": { "owner": opposite(side), "name": ProvinceData['alma'].name },
        "brome-lake": { "owner": opposite(side), "name": ProvinceData['brome-lake'].name },
        "hull": { "owner": opposite(side), "name": ProvinceData['hull'].name },
        "norenda": { "owner": opposite(side), "name": ProvinceData['norenda'].name },
        "brimstone": { "owner": opposite(side), "capital": opposite(side), "name": ProvinceData['brimstone'].name },
        "thetfordmines": { "owner": opposite(side), "name": ProvinceData['thetfordmines'].name },
        "sherbrooke": { "owner": opposite(side), "name": ProvinceData['sherbrooke'].name },
        "masson-lake": { "owner": opposite(side), "name": ProvinceData['masson-lake'].name },
        "kamouraska": { "owner": opposite(side), "name": ProvinceData['kamouraska'].name },
        "esterel": { "owner": opposite(side), "name": ProvinceData['esterel'].name },
        "valleyfield": { "owner": opposite(side), "name": ProvinceData['valleyfield'].name },
        "orford": { "owner": opposite(side), "name": ProvinceData['orford'].name },
        "three-rivers": { "owner": opposite(side), "name": ProvinceData['three-rivers'].name }
    };

    const game: GameDetails = {
        id: uuidv4(),
        defaultProvince: "",
        turn: {
            seed: Math.floor(Math.random() * Math.floor(2147483647)),
            number: 1,
            action: 0,
            kind: TurnKind.Strategic,
            owner: side // starts on your turn
        },
        sides: sides,
        provinces: {}
    };

    // We generate the starting information for both campaign types
    // then filter the data we save to the backend for simplicity
    const campaign = campaigns.provinces[campaignType];
    game.defaultProvince = campaigns.startingProvinces[campaignType];
    game.provinces = Object.keys(provinces)
        .filter(province => campaign.includes(province))
        .reduce((provinces: Record<ProvinceID, ProvinceDetails>, key: ProvinceID) => {
            const overview = provinces[key];
            provinces[key] = addExtendedProvinceInformation(key, side, overview);
            return provinces;
        }, {})
    return game;
};

export {
    generateGame
};