import { Alliance, StructureCategory, StructureKind } from './structures';
import { UnitKind, UnitMovement } from './units';

export interface GameRow {
  id: string;
  name: string;
  date: Date;
  kind: any;
  owner: any;
  number: any;
}

export type TurnMode = 'STRATEGIC' | 'TACTICAL';

export interface Turn {
  seed: number;
  number: number;
  action: number;
  kind: TurnMode;
  owner: Alliance;
}

export interface MissionOverview {
  description: string;
  objective: string;
  reward: string;
}

export interface ProvinceState {
  owner: Alliance;
  capital: Alliance;
  mission: MissionOverview;
  walls: { x: number; y: number }[];
  roads: { x: number; y: number }[];
  units: Record<UnitIdentifier, UnitEntityState> | undefined;
  structures: Record<StructureIdentifier, StructureEntityState> | undefined;
}

export interface UnitEntityState {
  id: UnitIdentifier;
  type: 'unit';
  kind: UnitKind;
  name: string;
  movement: UnitMovement;
  upkeep: number;
  experience: 1 | 2 | 3 | 4;
  hp: number;
  position: { x: number; y: number };
  facing: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  owner: Alliance;
  spritesheet: string;
  offset: number;
}

export type StructureState = 'DEFAULT' | 'UNDER_CONSTRUCTION';

export interface StructureEntityState {
  id: StructureIdentifier;
  type: 'structure';
  kind: StructureKind;
  category: StructureCategory;
  hp: {
    current: number;
    max: number;
  };
  units: {
    current: Record<UnitIdentifier, UnitEntityState>;
    max: number;
  };
  position: { x: number; y: number };
  owner: Alliance;
  state: StructureState;
  spritesheet: string;
  offset: number;
}

export type GameIdentifier = string;
export type PlayerIdentifier = string;
export type UnitIdentifier = string;
export type StructureIdentifier = string;

export type Technology = {
  'energy-efficiency': number;
  armour: number;
  speed: number;
  'weapon-damage': number;
  'rate-of-fire': number;
  rocketry: number;
};

export interface Side {
  globalReserve: number;
  name: string;
  type: 'PLAYER' | 'AI';
  owner: Alliance;
  difficulty: 0 | 1 | 2;
  technology: Technology;
}

export interface GameState {
  id: GameIdentifier;
  turn: Turn;
  sides: { [key: PlayerIdentifier]: Side };
  defaultProvince: string;
  provinces: Record<string, ProvinceState>;
}

export interface PlayerGameProjection {
  id: GameIdentifier;
  playerId: PlayerIdentifier;
  turn: Turn;
  player: Side;
  defaultProvince: string;
  provinces: Record<string, ProvinceState>;
  scannableProvinces: string[];
}

export const opposite = (side: Alliance) => {
  return side === 'HUMAN' ? 'ALIEN' : 'HUMAN';
};
