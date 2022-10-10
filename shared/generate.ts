interface ProvinceInitData {
  key: ProvinceKey;
  x: number;
  y: number;
  iconX?: number;
  iconY?: number;
  name: string;
  width: number;
  height: number;
  type: TerrainType;
  energy: number;
  credits: number;
  research: number;
  touching: ProvinceKey[];
}

const records: ProvinceInitData[] = [
  {
    key: ProvinceKey.Milos,
    x: 48,
    y: 204,
    iconX: 95,
    iconY: 253,
    width: 48,
    height: 48,
    name: 'Milos',
    type: TerrainType.Desert,
    energy: 30,
    credits: 15,
    research: 15,
    touching: [ProvinceKey.Cartasone, ProvinceKey.HighPoint, ProvinceKey.Sparta, ProvinceKey.Elkin]
  },
  {
    key: ProvinceKey.Marshall,
    x: 95,
    y: 31,
    width: 48,
    height: 48,
    name: 'Marshall',
    type: TerrainType.Rock,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Kinabal, ProvinceKey.Delos, ProvinceKey.Sparta, ProvinceKey.Aberdeen, ProvinceKey.Roanoke]
  },
  {
    key: ProvinceKey.RockCastle,
    x: 165,
    y: 125,
    width: 48,
    height: 48,
    name: 'Rock Castle',
    type: TerrainType.Rock,
    energy: 15,
    credits: 30,
    research: 15,
    touching: [ProvinceKey.Aberdeen, ProvinceKey.Sparta, ProvinceKey.HighPoint, ProvinceKey.Ayden]
  },
  {
    key: ProvinceKey.Elkin,
    x: 56,
    y: 183,
    width: 48,
    height: 48,
    name: 'Elkin',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Sparta, ProvinceKey.Milos]
  },
  {
    key: ProvinceKey.Aberdeen,
    x: 161,
    y: 78,
    width: 48,
    height: 48,
    name: 'Aberdeen',
    type: TerrainType.Forest,
    energy: 5,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.RockCastle, ProvinceKey.Sparta, ProvinceKey.Marshall, ProvinceKey.Roanoke, ProvinceKey.Creedmoor, ProvinceKey.Garland]
  },
  {
    key: ProvinceKey.Delos,
    x: 78,
    y: 50,
    width: 48,
    height: 48,
    name: 'Delos',
    type: TerrainType.Desert,
    energy: 10,
    credits: 10,
    research: 30,
    touching: [ProvinceKey.Sparta, ProvinceKey.Marshall, ProvinceKey.Kinabal, ProvinceKey.Norwood]
  },
  {
    key: ProvinceKey.Sparta,
    x: 117,
    y: 100,
    width: 48,
    height: 48,
    name: 'Sparta',
    type: TerrainType.Forest,
    energy: 10,
    credits: 5,
    research: 10,
    touching: [ProvinceKey.Elkin, ProvinceKey.Milos, ProvinceKey.HighPoint, ProvinceKey.RockCastle, ProvinceKey.Aberdeen, ProvinceKey.Marshall, ProvinceKey.Delos]
  },
  {
    key: ProvinceKey.Roanoke,
    x: 194,
    y: 37,
    width: 48,
    height: 48,
    name: 'Roanoke',
    type: TerrainType.Forest,
    energy: 15,
    credits: 15,
    research: 15,
    touching: [ProvinceKey.Marshall, ProvinceKey.Aberdeen, ProvinceKey.Creedmoor]
  },
  {
    key: ProvinceKey.Chaos,
    x: 291,
    y: 55,
    iconX: 362,
    iconY: 135,
    width: 48,
    height: 48,
    name: 'Chaos',
    type: TerrainType.Forest,
    energy: 30,
    credits: 15,
    research: 10,
    touching: [ProvinceKey.Garland, ProvinceKey.Creedmoor]
  },
  {
    key: ProvinceKey.Cartasone,
    x: 146,
    y: 223,
    width: 48,
    height: 48,
    name: 'Cartasone',
    type: TerrainType.Rock,
    energy: 15,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Haven, ProvinceKey.EagleNest, ProvinceKey.HighPoint, ProvinceKey.Milos]
  },
  {
    key: ProvinceKey.HighPoint,
    x: 171,
    y: 176,
    width: 48,
    height: 48,
    name: 'High Point',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.RockCastle, ProvinceKey.Ayden, ProvinceKey.EagleNest, ProvinceKey.Cartasone, ProvinceKey.Milos, ProvinceKey.Sparta]
  },
  {
    key: ProvinceKey.Haven,
    x: 181,
    y: 249,
    width: 48,
    height: 48,
    iconX: 240,
    iconY: 274,
    name: 'Haven',
    type: TerrainType.Forest,
    energy: 10,
    credits: 15,
    research: 10,
    touching: [ProvinceKey.Cartasone, ProvinceKey.EagleNest]
  },
  {
    key: ProvinceKey.Garland,
    x: 271,
    y: 82,
    width: 48,
    height: 48,
    name: 'Garland',
    type: TerrainType.Rock,
    energy: 10,
    credits: 10,
    research: 15,
    touching: [ProvinceKey.Aberdeen, ProvinceKey.Creedmoor, ProvinceKey.Chaos]
  },
  {
    key: ProvinceKey.Creedmoor,
    x: 239,
    y: 31,
    width: 48,
    height: 48,
    name: 'Creedmoor',
    type: TerrainType.Desert,
    energy: 15,
    credits: 15,
    research: 5,
    touching: [ProvinceKey.Roanoke, ProvinceKey.Aberdeen, ProvinceKey.Garland, ProvinceKey.Chaos]
  },
  {
    key: ProvinceKey.EagleNest,
    x: 226,
    y: 213,
    iconX: 261,
    iconY: 238,
    width: 48,
    height: 48,
    name: 'Eagle Nest',
    type: TerrainType.Desert,
    energy: 15,
    credits: 10,
    research: 15,
    touching: [ProvinceKey.Haven, ProvinceKey.Cartasone, ProvinceKey.HighPoint, ProvinceKey.Ayden, ProvinceKey.SnakeRiver]
  },
  {
    key: ProvinceKey.Chertsy,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Chertsy',
    type: TerrainType.Desert,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Rolland, ProvinceKey.Sutton, ProvinceKey.Rawdon, ProvinceKey.MassonLake]
  },
  {
    key: ProvinceKey.Sherbrooke,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Sherbrooke',
    type: TerrainType.Desert,
    energy: 15,
    credits: 15,
    research: 15,
    touching: [ProvinceKey.MassonLake, ProvinceKey.Hull, ProvinceKey.Thetfordmines, ProvinceKey.ThreeRivers, ProvinceKey.Kamouraska]
  },
  {
    key: ProvinceKey.ThreeRivers,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Three Rivers',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Valleyfield, ProvinceKey.Orford, ProvinceKey.Kamouraska, ProvinceKey.Sherbrooke, ProvinceKey.Thetfordmines]
  },
  {
    key: ProvinceKey.MassonLake,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Masson Lake',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Chertsy, ProvinceKey.Sherbrooke]
  },
  {
    key: ProvinceKey.Rawdon,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Rawdon',
    type: TerrainType.Forest,
    energy: 10,
    credits: 5,
    research: 5,
    touching: [ProvinceKey.Chertsy, ProvinceKey.Sutton, ProvinceKey.Bromont, ProvinceKey.Granby]
  },
  {
    key: ProvinceKey.Kamouraska,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Kamouraska',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Esterel, ProvinceKey.Orford, ProvinceKey.ThreeRivers, ProvinceKey.Sherbrooke]
  },
  {
    key: ProvinceKey.Esterel,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Esterel',
    type: TerrainType.Forest,
    energy: 15,
    credits: 15,
    research: 15,
    touching: [ProvinceKey.Kamouraska, ProvinceKey.Orford, ProvinceKey.Valleyfield]
  },
  {
    key: ProvinceKey.Bromont,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Bromont',
    type: TerrainType.Rock,
    energy: 10,
    credits: 15,
    research: 5,
    touching: [ProvinceKey.Lachine, ProvinceKey.Sutton, ProvinceKey.Rawdon, ProvinceKey.Granby, ProvinceKey.Alma]
  },
  {
    key: ProvinceKey.BromeLake,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Brome Lake',
    type: TerrainType.Forest,
    energy: 30,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Granby, ProvinceKey.Alma, ProvinceKey.Hull, ProvinceKey.Norenda]
  },
  {
    key: ProvinceKey.Lachine,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Lachine',
    type: TerrainType.Forest,
    energy: 5,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.FreeCity, ProvinceKey.Sutton, ProvinceKey.Bromont]
  },
  {
    key: ProvinceKey.Sutton,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Sutton',
    type: TerrainType.Forest,
    energy: 30,
    credits: 10,
    research: 5,
    touching: [ProvinceKey.FreeCity, ProvinceKey.Rolland, ProvinceKey.Chertsy, ProvinceKey.Rawdon, ProvinceKey.Bromont, ProvinceKey.Lachine]
  },
  {
    key: ProvinceKey.Hull,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Hull',
    type: TerrainType.Forest,
    energy: 5,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.BromeLake, ProvinceKey.Norenda, ProvinceKey.Thetfordmines, ProvinceKey.Sherbrooke]
  },
  {
    key: ProvinceKey.Rolland,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Rolland',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.FreeCity, ProvinceKey.Sutton, ProvinceKey.Chertsy]
  },
  {
    key: ProvinceKey.Granby,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Granby',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Rawdon, ProvinceKey.Bromont, ProvinceKey.Alma, ProvinceKey.BromeLake]
  },
  {
    key: ProvinceKey.Alma,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Alma',
    type: TerrainType.Rock,
    energy: 10,
    credits: 10,
    research: 15,
    touching: [ProvinceKey.Bromont, ProvinceKey.Granby, ProvinceKey.BromeLake]
  },
  {
    key: ProvinceKey.FreeCity,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Free City',
    type: TerrainType.Rock,
    energy: 30,
    credits: 30,
    research: 15,
    touching: [ProvinceKey.Lachine, ProvinceKey.Sutton, ProvinceKey.Rolland]
  },
  {
    key: ProvinceKey.Norenda,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Norenda',
    type: TerrainType.Desert,
    energy: 15,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.BromeLake, ProvinceKey.Hull, ProvinceKey.Thetfordmines, ProvinceKey.Brimstone]
  },
  {
    key: ProvinceKey.Thetfordmines,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Thetfordmines',
    type: TerrainType.Rock,
    energy: 15,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.ThreeRivers, ProvinceKey.Sherbrooke, ProvinceKey.Hull, ProvinceKey.Norenda, ProvinceKey.Brimstone]
  },
  {
    key: ProvinceKey.Brimstone,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Brimstone',
    type: TerrainType.Forest,
    energy: 15,
    credits: 15,
    research: 30,
    touching: [ProvinceKey.Norenda, ProvinceKey.Thetfordmines]
  },
  {
    key: ProvinceKey.Orford,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Orford',
    type: TerrainType.Rock,
    energy: 10,
    credits: 10,
    research: 5,
    touching: [ProvinceKey.Esterel, ProvinceKey.Valleyfield, ProvinceKey.ThreeRivers, ProvinceKey.Kamouraska]
  },
  {
    key: ProvinceKey.Waterloo,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Waterloo',
    type: TerrainType.Desert,
    energy: 10,
    credits: 10,
    research: 10,
    touching: []
  },
  {
    key: ProvinceKey.Valleyfield,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Valleyfield',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Esterel, ProvinceKey.Orford, ProvinceKey.ThreeRivers]
  },
  {
    key: ProvinceKey.Balkany,
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    name: 'Balkany',
    type: TerrainType.Rock,
    energy: 10,
    credits: 10,
    research: 15,
    touching: []
  },
  {
    key: ProvinceKey.SnakeRiver,
    x: 268,
    y: 185,
    width: 48,
    height: 48,
    name: 'Snake River',
    type: TerrainType.Forest,
    energy: 5,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.EagleNest, ProvinceKey.Ayden, ProvinceKey.Canuck, ProvinceKey.PointHarbour]
  },
  {
    key: ProvinceKey.Ayden,
    x: 232,
    y: 168,
    width: 48,
    height: 48,
    name: 'Ayden',
    type: TerrainType.Forest,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.RockCastle, ProvinceKey.HighPoint, ProvinceKey.EagleNest, ProvinceKey.SnakeRiver, ProvinceKey.Canuck]
  },
  {
    key: ProvinceKey.Canuck,
    x: 309,
    y: 159,
    iconX: 366,
    iconY: 202,
    width: 48,
    height: 48,
    name: 'Canuck',
    type: TerrainType.Rock,
    energy: 10,
    credits: 10,
    research: 10,
    touching: [ProvinceKey.Ayden, ProvinceKey.SnakeRiver, ProvinceKey.PointHarbour]
  },
  {
    key: ProvinceKey.PointHarbour,
    x: 319,
    y: 231,
    width: 48,
    height: 48,
    name: 'Point Harbour',
    type: TerrainType.Forest,
    energy: 10,
    credits: 15,
    research: 5,
    touching: [ProvinceKey.SnakeRiver, ProvinceKey.Canuck]
  },
  {
    key: ProvinceKey.Norwood,
    x: 40,
    y: 71,
    width: 48,
    height: 48,
    name: 'Norwood',
    type: TerrainType.Forest,
    energy: 10,
    credits: 5,
    research: 10,
    touching: [ProvinceKey.Kinabal, ProvinceKey.Delos]
  },
  {
    key: ProvinceKey.Kinabal,
    x: 27,
    y: 21,
    iconX: 62,
    iconY: 48,
    width: 48,
    height: 48,
    name: 'Kinabal',
    type: TerrainType.Forest,
    energy: 15,
    credits: 15,
    research: 15,
    touching: [ProvinceKey.Norwood, ProvinceKey.Delos, ProvinceKey.Marshall]
  }
];

import { Builder } from 'flatbuffers';
import { writeFileSync } from 'fs';
import { ProvinceLookup } from './buffer/data/province-lookup';
import { Province, ProvinceKey, Vec2, TerrainType } from './provinces';

// JSON -> Flatbuffer
let builder = new Builder(1024);

const provinceOffsets = records.map((value) => {
  const touchingOffset = Province.createTouchingVector(builder, value.touching);
  const nameOffset = builder.createString(value.name);
  // const tilesOffset = 0;
  Province.startProvince(builder);
  Province.addKey(builder, value.key);
  Province.addName(builder, nameOffset);
  Province.addPos(builder, Vec2.createVec2(builder, value.x, value.y));
  if (value.iconX && value.iconY) {
    Province.addIconPos(builder, Vec2.createVec2(builder, value.iconX, value.iconY));
  }
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
const provincesOffset = ProvinceLookup.createProvincesVector(builder, provinceOffsets);
ProvinceLookup.startProvinceLookup(builder);
ProvinceLookup.addProvinces(builder, provincesOffset);
const provinceLookupOffset = ProvinceLookup.endProvinceLookup(builder);

builder.finish(provinceLookupOffset);

const provinces = builder.asUint8Array();

writeFileSync('./src/data/provinces.bin', provinces, { flag: 'w' });
