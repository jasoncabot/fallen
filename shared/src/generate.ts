const records = [
    { key: "milos", "x": 48, "y": 204, "iconX": 95, "iconY": 253, "width": 48, "height": 48, "name": "Milos", "type": TerrainType.Desert, "energy": 30, "credits": 15, "research": 15, "touching": ["cartasone", "high-point", "sparta", "elkin"] },
    { key: "marshall", "x": 95, "y": 31, "width": 48, "height": 48, "name": "Marshall", "type": TerrainType.Rock, "energy": 10, "credits": 10, "research": 10, "touching": ["kinabal", "delos", "sparta", "aberdeen", "roanoke"] },
    { key: "rock-castle", "x": 165, "y": 125, "width": 48, "height": 48, "name": "Rock Castle", "type": TerrainType.Rock, "energy": 15, "credits": 30, "research": 15, "touching": ["aberdeen", "sparta", "high-point", "ayden"] },
    { key: "elkin", "x": 56, "y": 183, "width": 48, "height": 48, "name": "Elkin", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["sparta", "milos"] },
    { key: "aberdeen", "x": 161, "y": 78, "width": 48, "height": 48, "name": "Aberdeen", "type": TerrainType.Forest, "energy": 5, "credits": 10, "research": 10, "touching": ["rock-castle", "sparta", "marshall", "roanoke", "creedmoor", "garland"] },
    { key: "delos", "x": 78, "y": 50, "width": 48, "height": 48, "name": "Delos", "type": TerrainType.Desert, "energy": 10, "credits": 10, "research": 30, "touching": ["sparta", "marshall", "kinabal", "norwood"] },
    { key: "sparta", "x": 117, "y": 100, "width": 48, "height": 48, "name": "Sparta", "type": TerrainType.Forest, "energy": 10, "credits": 5, "research": 10, "touching": ["elkin", "milos", "high-point", "rock-castle", "aberdeen", "marshall", "delos"] },
    { key: "roanoke", "x": 194, "y": 37, "width": 48, "height": 48, "name": "Roanoke", "type": TerrainType.Forest, "energy": 15, "credits": 15, "research": 15, "touching": ["marshall", "aberdeen", "creedmoor"] },
    { key: "chaos", "x": 291, "y": 55, "iconX": 362, "iconY": 135, "width": 48, "height": 48, "name": "Chaos", "type": TerrainType.Forest, "energy": 30, "credits": 15, "research": 10, "touching": ["garland", "creedmoor"] },
    { key: "cartasone", "x": 146, "y": 223, "width": 48, "height": 48, "name": "Cartasone", "type": TerrainType.Rock, "energy": 15, "credits": 10, "research": 10, "touching": ["haven", "eagle-nest", "high-point", "milos"] },
    { key: "high-point", "x": 171, "y": 176, "width": 48, "height": 48, "name": "High Point", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["rock-castle", "ayden", "eagle-nest", "cartasone", "milos", "sparta"] },
    { key: "haven", "x": 181, "y": 249, "width": 48, "height": 48, "iconX": 240, "iconY": 274, "name": "Haven", "type": TerrainType.Forest, "energy": 10, "credits": 15, "research": 10, "touching": ["cartasone", "eagle-nest"] },
    { key: "garland", "x": 271, "y": 82, "width": 48, "height": 48, "name": "Garland", "type": TerrainType.Rock, "energy": 10, "credits": 10, "research": 15, "touching": ["aberdeen", "creedmoor", "chaos"] },
    { key: "creedmoor", "x": 239, "y": 31, "width": 48, "height": 48, "name": "Creedmoor", "type": TerrainType.Desert, "energy": 15, "credits": 15, "research": 5, "touching": ["roanoke", "aberdeen", "garland", "chaos"] },
    { key: "eagle-nest", "x": 226, "y": 213, "iconX": 261, "iconY": 238, "width": 48, "height": 48, "name": "Eagle Nest", "type": TerrainType.Desert, "energy": 15, "credits": 10, "research": 15, "touching": ["haven", "cartasone", "high-point", "ayden", "snake-river"] },
    { key: "chertsy", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Chertsy", "type": TerrainType.Desert, "energy": 10, "credits": 10, "research": 10, "touching": ["rolland", "sutton", "rawdon", "masson-lake"] },
    { key: "sherbrooke", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Sherbrooke", "type": TerrainType.Desert, "energy": 15, "credits": 15, "research": 15, "touching": ["masson-lake", "hull", "thetfordmines", "three-rivers", "kamouraska"] },
    { key: "three-rivers", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Three Rivers", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["valleyfield", "orford", "kamouraska", "sherbrooke", "thetfordmines"] },
    { key: "masson-lake", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Masson Lake", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["chertsy", "sherbrooke"] },
    { key: "rawdon", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Rawdon", "type": TerrainType.Forest, "energy": 10, "credits": 5, "research": 5, "touching": ["chertsy", "sutton", "bromont", "granby"] },
    { key: "kamouraska", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Kamouraska", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["esterel", "orford", "three-rivers", "sherbrooke"] },
    { key: "esterel", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Esterel", "type": TerrainType.Forest, "energy": 15, "credits": 15, "research": 15, "touching": ["kamouraska", "orford", "valleyfield"] },
    { key: "bromont", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Bromont", "type": TerrainType.Rock, "energy": 10, "credits": 15, "research": 5, "touching": ["lachine", "sutton", "rawdon", "granby", "alma"] },
    { key: "brome-lake", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Brome Lake", "type": TerrainType.Forest, "energy": 30, "credits": 10, "research": 10, "touching": ["granby", "alma", "hull", "norenda"] },
    { key: "lachine", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Lachine", "type": TerrainType.Forest, "energy": 5, "credits": 10, "research": 10, "touching": ["free-city", "sutton", "bromont"] },
    { key: "sutton", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Sutton", "type": TerrainType.Forest, "energy": 30, "credits": 10, "research": 5, "touching": ["free-city", "rolland", "chertsy", "rawdon", "bromont", "lachine"] },
    { key: "hull", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Hull", "type": TerrainType.Forest, "energy": 5, "credits": 10, "research": 10, "touching": ["brome-lake", "norenda", "thetfordmines", "sherbrooke"] },
    { key: "rolland", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Rolland", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["free-city", "sutton", "chertsy"] },
    { key: "granby", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Granby", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["rawdon", "bromont", "alma", "brome-lake"] },
    { key: "alma", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Alma", "type": TerrainType.Rock, "energy": 10, "credits": 10, "research": 15, "touching": ["bromont", "granby", "brome-lake"] },
    { key: "free-city", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Free City", "type": TerrainType.Rock, "energy": 30, "credits": 30, "research": 15, "touching": ["lachine", "sutton", "rolland"] },
    { key: "norenda", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Norenda", "type": TerrainType.Desert, "energy": 15, "credits": 10, "research": 10, "touching": ["brome-lake", "hull", "thetfordmines", "brimstone"] },
    { key: "thetfordmines", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Thetfordmines", "type": TerrainType.Rock, "energy": 15, "credits": 10, "research": 10, "touching": ["three-rivers", "sherbrooke", "hull", "norenda", "brimstone"] },
    { key: "brimstone", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Brimstone", "type": TerrainType.Forest, "energy": 15, "credits": 15, "research": 30, "touching": ["norenda", "thetfordmines"] },
    { key: "orford", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Orford", "type": TerrainType.Rock, "energy": 10, "credits": 10, "research": 5, "touching": ["esterel", "valleyfield", "three-rivers", "kamouraska"] },
    { key: "waterloo", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Waterloo", "type": TerrainType.Desert, "energy": 10, "credits": 10, "research": 10, "touching": [] },
    { key: "valleyfield", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Valleyfield", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["esterel", "orford", "three-rivers"] },
    { key: "balkany", "x": 0, "y": 0, "width": 48, "height": 48, "name": "Balkany", "type": TerrainType.Rock, "energy": 10, "credits": 10, "research": 15, "touching": [] },
    { key: "snake-river", "x": 268, "y": 185, "width": 48, "height": 48, "name": "Snake River", "type": TerrainType.Forest, "energy": 5, "credits": 10, "research": 10, "touching": ["eagle-nest", "ayden", "canuck", "point-harbour"] },
    { key: "ayden", "x": 232, "y": 168, "width": 48, "height": 48, "name": "Ayden", "type": TerrainType.Forest, "energy": 10, "credits": 10, "research": 10, "touching": ["rock-castle", "high-point", "eagle-nest", "snake-river", "canuck"] },
    { key: "canuck", "x": 309, "y": 159, "iconX": 366, "iconY": 202, "width": 48, "height": 48, "name": "Canuck", "type": TerrainType.Rock, "energy": 10, "credits": 10, "research": 10, "touching": ["ayden", "snake-river", "point-harbour"] },
    { key: "point-harbour", "x": 319, "y": 231, "width": 48, "height": 48, "name": "Point Harbour", "type": TerrainType.Forest, "energy": 10, "credits": 15, "research": 5, "touching": ["snake-river", "canuck"] },
    { key: "norwood", "x": 40, "y": 71, "width": 48, "height": 48, "name": "Norwood", "type": TerrainType.Forest, "energy": 10, "credits": 5, "research": 10, "touching": ["kinabal", "delos"] },
    { key: "kinabal", "x": 27, "y": 21, "iconX": 62, "iconY": 48, "width": 48, "height": 48, "name": "Kinabal", "type": TerrainType.Forest, "energy": 15, "credits": 15, "research": 15, "touching": ["norwood", "delos", "marshall"] }
];

import { Builder } from "flatbuffers";
import { writeFileSync } from "fs";
import { ProvinceLookup } from "./buffer/data/province-lookup";
import { Province, ProvinceKey, Vec2, TerrainType } from "./provinces";

// JSON -> Flatbuffer
let builder = new Builder(1024);

const toProvinceKey = (s: string) => {
    switch (s) {
        case "aberdeen": return ProvinceKey.Aberdeen;
        case "alma": return ProvinceKey.Alma;
        case "ayden": return ProvinceKey.Ayden;
        case "balkany": return ProvinceKey.Balkany;
        case "brimstone": return ProvinceKey.Brimstone;
        case "brome-lake": return ProvinceKey.BromeLake;
        case "bromont": return ProvinceKey.Bromont;
        case "canuck": return ProvinceKey.Canuck;
        case "cartasone": return ProvinceKey.Cartasone;
        case "chaos": return ProvinceKey.Chaos;
        case "chertsy": return ProvinceKey.Chertsy;
        case "creedmoor": return ProvinceKey.Creedmoor;
        case "delos": return ProvinceKey.Delos;
        case "eagle-nest": return ProvinceKey.EagleNest;
        case "elkin": return ProvinceKey.Elkin;
        case "esterel": return ProvinceKey.Esterel;
        case "free-city": return ProvinceKey.FreeCity;
        case "garland": return ProvinceKey.Garland;
        case "granby": return ProvinceKey.Granby;
        case "haven": return ProvinceKey.Haven;
        case "high-point": return ProvinceKey.HighPoint;
        case "hull": return ProvinceKey.Hull;
        case "kamouraska": return ProvinceKey.Kamouraska;
        case "kinabal": return ProvinceKey.Kinabal;
        case "lachine": return ProvinceKey.Lachine;
        case "marshall": return ProvinceKey.Marshall;
        case "masson-lake": return ProvinceKey.MassonLake;
        case "milos": return ProvinceKey.Milos;
        case "norenda": return ProvinceKey.Norenda;
        case "norwood": return ProvinceKey.Norwood;
        case "orford": return ProvinceKey.Orford;
        case "point-harbour": return ProvinceKey.PointHarbour;
        case "rawdon": return ProvinceKey.Rawdon;
        case "roanoke": return ProvinceKey.Roanoke;
        case "rock-castle": return ProvinceKey.RockCastle;
        case "rolland": return ProvinceKey.Rolland;
        case "sherbrooke": return ProvinceKey.Sherbrooke;
        case "snake-river": return ProvinceKey.SnakeRiver;
        case "sparta": return ProvinceKey.Sparta;
        case "sutton": return ProvinceKey.Sutton;
        case "thetfordmines": return ProvinceKey.Thetfordmines;
        case "three-rivers": return ProvinceKey.ThreeRivers;
        case "valleyfield": return ProvinceKey.Valleyfield;
        case "waterloo": return ProvinceKey.Waterloo;
    }
}

const provinceOffsets = records.map(value => {
    const touchingOffset = Province.createTouchingVector(builder, value.touching.map(toProvinceKey));
    const nameOffset = builder.createString(value.name);
    // const tilesOffset = 0;
    Province.startProvince(builder);
    Province.addKey(builder, toProvinceKey(value.key));
    Province.addName(builder, nameOffset);
    Province.addPos(builder, Vec2.createVec2(builder, value.x, value.y));
    Province.addIconPos(builder, Vec2.createVec2(builder, value.iconX, value.iconY));
    Province.addWidth(builder, value.width);
    Province.addHeight(builder, value.height);
    Province.addType(builder, value.type);
    Province.addEnergy(builder, value.energy);
    Province.addCredits(builder, value.credits);
    Province.addResearch(builder, value.research);
    Province.addTouching(builder, touchingOffset);
    // Province.addTiles(builder, tilesOffset);
    const provinceOffset = Province.endProvince(builder);
    return provinceOffset;
});
const provincesOffset = ProvinceLookup.createProvincesVector(builder, provinceOffsets)
ProvinceLookup.startProvinceLookup(builder);
ProvinceLookup.addProvinces(builder, provincesOffset);
const provinceLookupOffset = ProvinceLookup.endProvinceLookup(builder);

builder.finish(provinceLookupOffset);

const provinces = builder.asUint8Array();

writeFileSync("./src/data/provinces.bin", provinces, { flag: 'w' });
