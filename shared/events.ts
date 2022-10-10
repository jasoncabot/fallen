import {
  PlayerIdentifier,
  StructureIdentifier,
  TurnMode,
  UnitIdentifier
} from './game';
import { BattleIdentifier, CommandEnvelope, CommandIdentifier, ProvinceIdentifier } from './commands';

export type EventSequence = number;

export interface EventEnvelope<TEvent extends GameEvent = GameEvent> {
  sequence: EventSequence;
  gameId: string;
  battleId?: BattleIdentifier;
  turnNumber: number;
  action: number;
  mode: TurnMode;
  emittedAtMs: number;
  causedByCommandId?: CommandIdentifier;
  event: TEvent;
}

export type GameEvent =
  | CommandAcceptedEvent
  | CommandRejectedEvent
  | UnitMovedEvent
  | UnitTurnedEvent
  | UnitDamagedEvent
  | UnitDestroyedEvent
  | StructureBuiltEvent
  | StructureDamagedEvent
  | StructureDestroyedEvent
  | RoadUpdatedEvent
  | WallUpdatedEvent
  | ProvinceInvadedEvent
  | TacticalBattleStartedEvent
  | TacticalBattleFinishedEvent
  | TurnAdvancedEvent
  | ReplaySnapshotEvent;

export interface CommandAcceptedEvent {
  type: 'COMMAND_ACCEPTED';
  command: CommandEnvelope;
}

export interface CommandRejectedEvent {
  type: 'COMMAND_REJECTED';
  commandId: CommandIdentifier;
  reason:
    | 'NOT_YOUR_TURN'
    | 'INVALID_ACTION_INDEX'
    | 'INVALID_MODE'
    | 'INVALID_TARGET'
    | 'NOT_AUTHORISED'
    | 'RULE_VIOLATION';
  message: string;
}

export interface UnitMovedEvent {
  type: 'UNIT_MOVED';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface UnitTurnedEvent {
  type: 'UNIT_TURNED';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  facing: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface UnitDamagedEvent {
  type: 'UNIT_DAMAGED';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  damage: number;
  hpRemaining: number;
}

export interface UnitDestroyedEvent {
  type: 'UNIT_DESTROYED';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
}

export interface StructureBuiltEvent {
  type: 'STRUCTURE_BUILT';
  provinceId: ProvinceIdentifier;
  structureId: StructureIdentifier;
}

export interface StructureDamagedEvent {
  type: 'STRUCTURE_DAMAGED';
  provinceId: ProvinceIdentifier;
  structureId: StructureIdentifier;
  damage: number;
  hpRemaining: number;
}

export interface StructureDestroyedEvent {
  type: 'STRUCTURE_DESTROYED';
  provinceId: ProvinceIdentifier;
  structureId: StructureIdentifier;
}

export interface RoadUpdatedEvent {
  type: 'ROAD_UPDATED';
  provinceId: ProvinceIdentifier;
  tiles: Array<{ x: number; y: number; tileId?: number }>;
}

export interface WallUpdatedEvent {
  type: 'WALL_UPDATED';
  provinceId: ProvinceIdentifier;
  tiles: Array<{ x: number; y: number; tileId?: number }>;
}

export interface ProvinceInvadedEvent {
  type: 'PROVINCE_INVADED';
  fromProvinceId: ProvinceIdentifier;
  toProvinceId: ProvinceIdentifier;
  attackerPlayerId: PlayerIdentifier;
  defenderPlayerId: PlayerIdentifier;
}

export interface TacticalBattleStartedEvent {
  type: 'TACTICAL_BATTLE_STARTED';
  battleId: BattleIdentifier;
  provinceId: ProvinceIdentifier;
  attackerPlayerId: PlayerIdentifier;
  defenderPlayerId: PlayerIdentifier;
  tacticalTurnOwner: PlayerIdentifier;
}

export interface TacticalBattleFinishedEvent {
  type: 'TACTICAL_BATTLE_FINISHED';
  battleId: BattleIdentifier;
  provinceId: ProvinceIdentifier;
  winnerPlayerId: PlayerIdentifier;
  newOwner: 'HUMAN' | 'ALIEN' | 'NEUTRAL';
}

export interface TurnAdvancedEvent {
  type: 'TURN_ADVANCED';
  previousTurnNumber: number;
  nextTurnNumber: number;
  nextAction: number;
  nextMode: TurnMode;
  nextOwner: 'HUMAN' | 'ALIEN' | 'NEUTRAL';
}

export interface ReplaySnapshotEvent {
  type: 'REPLAY_SNAPSHOT';
  snapshotVersion: number;
  stateHash: string;
}
