import { Alliance, StructureData, type StructureCategory } from '../../shared/structures';
import { UnitData, type UnitCategory } from '../../shared/units';
import { opposite } from '../../shared/game';
import type { GameState, ProvinceState, UnitEntityState, StructureEntityState } from '../../shared/game';
import { campaigns } from './seeding/campaigns';
import { startingCash } from './seeding/cash';
import { missionForProvince } from './seeding/missions';
import { walls } from './seeding/walls';
import { roads } from './seeding/roads';
import { units as unitSeeds, type UnitSeed } from './seeding/units';
import { structures as structureSeeds, type StructureSeed } from './seeding/structures';
import { ProvinceKey } from '../../shared/provinces';

// Maps generic unit role names to faction-specific unit type keys
const unitLookup: Record<Alliance, Record<string, UnitCategory>> = {
  HUMAN: { SQUAD: 'HSQU', TROOP: 'HRAN', LTTANK: 'HATV', LONGRANGE: 'HART', UNIQUE1: 'HBUG', TANK: 'HTNK', LTGRAV: 'HSPE', HEAVYGRAV: 'HGRV', LONGRANGEHOVER: 'HGUN' },
  ALIEN: { SQUAD: 'ASQD', TROOP: 'ASNI', LTTANK: 'ALTK', LONGRANGE: 'APLA', HEAVYGRAV: 'AGRV', LTGRAV: 'AFLY', TANK: 'AMDT', LONGRANGEHOVER: 'ASUP', UNIQUE1: 'AMEG' },
  NEUTRAL: { SQUAD: 'NGRV', LTTANK: 'NATV', TANK: 'NTNK', LONGRANGE: 'NROC' }
};

const structureLookup: Record<Alliance, Record<string, StructureCategory>> = {
  HUMAN: { AIRPORT: 'HAIR', ANTIMISSILE: 'HDEF', BARRACKS: 'HBAR', DROPSHIP: 'HSHP', ENERGY: 'HENY', FACTORY: 'HFAC', LAB: 'HLAB', MINING: 'HMIN', MISSILE: 'HSIL', SCANNER: 'HRAD', STARPORT: 'HBAY', TOWER: 'HTUR' },
  ALIEN: { AIRPORT: 'AAIR', ANTIMISSILE: 'ADEF', BARRACKS: 'ABAR', DROPSHIP: 'ASHP', ENERGY: 'AENY', FACTORY: 'AFAC', LAB: 'ALAB', MINING: 'AMIN', MISSILE: 'ASIL', SCANNER: 'ARAD', STARPORT: 'ABAY', TOWER: 'ATUR' },
  NEUTRAL: { AIRPORT: 'HAIR', ANTIMISSILE: 'HDEF', BARRACKS: 'HBAR', DROPSHIP: 'HSHP', ENERGY: 'HENY', FACTORY: 'HFAC', LAB: 'HLAB', MINING: 'HMIN', MISSILE: 'HSIL', SCANNER: 'HRAD', STARPORT: 'HBAY', TOWER: 'HTUR' }
};

function resolveOwner(explicitOwner: string | undefined, containerOwner: Alliance, playerSide: Alliance): Alliance {
  if (explicitOwner === 'PLAYER') return playerSide;
  if (explicitOwner === 'OPPOSITE') return opposite(playerSide);
  return containerOwner;
}

function buildUnit(seed: UnitSeed, containerOwner: Alliance, playerSide: Alliance): UnitEntityState {
  const owner = resolveOwner(seed.owner, containerOwner, playerSide);
  const typeKey = unitLookup[owner][seed.type];
  const ref = UnitData[typeKey];
  return {
    id: crypto.randomUUID(),
    type: 'unit',
    kind: ref.kind,
    name: ref.kind.name,
    movement: ref.movement,
    upkeep: ref.upkeep,
    experience: seed.experience as 1 | 2 | 3 | 4,
    hp: ref.hp,
    position: seed.position,
    facing: 0,
    owner,
    spritesheet: ref.display.tiles,
    offset: ref.display.offset
  };
}

function buildStructure(seed: StructureSeed, provinceOwner: Alliance, playerSide: Alliance): StructureEntityState {
  const owner = provinceOwner;
  const typeKey = structureLookup[owner][seed.type];
  const ref = StructureData[typeKey];
  const innerUnits: Record<string, UnitEntityState> = {};
  for (const u of seed.units ?? []) {
    const built = buildUnit({ ...u, position: { x: 0, y: 0 } }, owner, playerSide);
    innerUnits[built.id] = built;
  }
  return {
    id: crypto.randomUUID(),
    type: 'structure',
    kind: ref.kind,
    category: ref.kind.category,
    hp: { current: ref.hp, max: ref.hp },
    units: { current: innerUnits, max: 0 },
    position: seed.position,
    owner,
    state: 'DEFAULT',
    spritesheet: ref.display.tiles,
    offset: ref.display.offset
  };
}

function buildProvince(key: string, owner: Alliance, playerSide: Alliance, isCapital: boolean): ProvinceState {
  const provinceKey = Object.values(ProvinceKey).find((k) => k.toString() === key) as ProvinceKey | undefined;
  const mission = provinceKey != null ? missionForProvince(provinceKey) : undefined;

  const provinceUnits: Record<string, UnitEntityState> = {};
  for (const seed of unitSeeds[key] ?? []) {
    const unit = buildUnit(seed, owner, playerSide);
    provinceUnits[unit.id] = unit;
  }

  const provinceStructures: Record<string, StructureEntityState> = {};
  for (const seed of structureSeeds[key] ?? []) {
    const structure = buildStructure(seed, owner, playerSide);
    provinceStructures[structure.id] = structure;
  }

  return {
    owner,
    capital: isCapital ? owner : ('' as Alliance),
    mission: mission ?? { description: '', objective: '', reward: '' },
    walls: walls[key] ?? [],
    roads: roads[key] ?? [],
    units: provinceUnits,
    structures: provinceStructures
  };
}

export function generateGame(userId: string, name: string, race: number, difficulty: number, campaignIndex: number): GameState {
  const playerSide: Alliance = race === 0 ? 'HUMAN' : 'ALIEN';
  const aiSide = opposite(playerSide);

  const clampedDifficulty = (Math.min(2, Math.max(0, difficulty))) as 0 | 1 | 2;
  const defaultTech = { 'energy-efficiency': 0, armour: 0, speed: 0, 'weapon-damage': 0, 'rate-of-fire': 0, rocketry: 0 };

  const sides: GameState['sides'] = {
    [userId]: {
      globalReserve: startingCash[clampedDifficulty] ?? 6000,
      name,
      type: 'PLAYER',
      owner: playerSide,
      difficulty: clampedDifficulty,
      technology: defaultTech
    },
    [crypto.randomUUID()]: {
      globalReserve: startingCash[2 - clampedDifficulty] ?? 6000,
      name: 'Computer',
      type: 'AI',
      owner: aiSide,
      difficulty: clampedDifficulty,
      technology: defaultTech
    }
  };

  const allProvinces: Record<string, { owner: Alliance; capital?: Alliance }> = {
    cartasone: { owner: 'NEUTRAL' }, 'eagle-nest': { owner: 'NEUTRAL' },
    haven: { owner: playerSide, capital: playerSide },
    'free-city': { owner: playerSide, capital: playerSide },
    lachine: { owner: aiSide }, sutton: { owner: aiSide },
    milos: { owner: 'NEUTRAL' }, 'high-point': { owner: 'NEUTRAL' }, ayden: { owner: 'NEUTRAL' },
    'snake-river': { owner: 'NEUTRAL' }, canuck: { owner: 'NEUTRAL' }, 'point-harbour': { owner: 'NEUTRAL' },
    'rock-castle': { owner: 'NEUTRAL' }, sparta: { owner: 'NEUTRAL' }, aberdeen: { owner: 'NEUTRAL' },
    delos: { owner: 'NEUTRAL' }, elkin: { owner: 'NEUTRAL' }, norwood: { owner: 'NEUTRAL' },
    kinabal: { owner: 'NEUTRAL' }, marshall: { owner: 'NEUTRAL' }, roanoke: { owner: 'NEUTRAL' },
    creedmoor: { owner: 'NEUTRAL' }, garland: { owner: 'NEUTRAL' },
    chaos: { owner: aiSide, capital: aiSide },
    rolland: { owner: aiSide }, chertsy: { owner: aiSide }, bromont: { owner: aiSide },
    rawdon: { owner: aiSide }, granby: { owner: aiSide }, alma: { owner: aiSide },
    'brome-lake': { owner: aiSide }, hull: { owner: aiSide }, norenda: { owner: aiSide },
    brimstone: { owner: aiSide, capital: aiSide },
    thetfordmines: { owner: aiSide }, sherbrooke: { owner: aiSide }, 'masson-lake': { owner: aiSide },
    kamouraska: { owner: aiSide }, esterel: { owner: aiSide }, valleyfield: { owner: aiSide },
    orford: { owner: aiSide }, 'three-rivers': { owner: aiSide }
  };

  const campaignProvinces = campaigns.provinces[campaignIndex] ?? campaigns.provinces[0];
  const provinces: GameState['provinces'] = {};
  for (const key of campaignProvinces) {
    const p = allProvinces[key];
    if (!p) continue;
    provinces[key] = buildProvince(key, p.owner, playerSide, !!p.capital);
  }

  return {
    id: crypto.randomUUID(),
    defaultProvince: campaigns.startingProvinces[campaignIndex] ?? 'haven',
    turn: {
      seed: Math.floor(Math.random() * 2147483647),
      number: 1,
      action: 0,
      kind: 'STRATEGIC',
      owner: playerSide
    },
    sides,
    provinces
  };
}
