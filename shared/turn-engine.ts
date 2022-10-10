import { GameState, PlayerIdentifier, TurnMode } from './game';
import { BattleIdentifier, CommandEnvelope, ProvinceIdentifier } from './commands';
import { EventEnvelope } from './events';

export type PhaseKind = 'STRATEGIC' | 'TACTICAL';

export interface TacticalPhase {
  kind: 'TACTICAL';
  provinceId: string;
  attackerPlayerId: PlayerIdentifier;
  defenderPlayerId: PlayerIdentifier;
  round: number;
  tacticalTurnOwner: PlayerIdentifier;
}

export interface StrategicPhase {
  kind: 'STRATEGIC';
}

export type GamePhase = StrategicPhase | TacticalPhase;

export interface EventLogCursor {
  nextSequence: number;
  nextAction: number;
}

export interface GameRuntimeState {
  game: GameState;
  phase: GamePhase;
  cursor: EventLogCursor;
}

export interface BattleRuntimeState {
  battleId: BattleIdentifier;
  gameId: string;
  provinceId: ProvinceIdentifier;
  attackerPlayerId: PlayerIdentifier;
  defenderPlayerId: PlayerIdentifier;
  tacticalTurnOwner: PlayerIdentifier;
  round: number;
  cursor: EventLogCursor;
}

export interface BattleReference {
  battleId: BattleIdentifier;
  provinceId: ProvinceIdentifier;
}

export interface BattleStartedResult {
  battle: BattleReference;
  gameState: GameRuntimeState;
  events: EventEnvelope[];
}

export interface BattleFinishedResult {
  battleId: BattleIdentifier;
  gameState: GameRuntimeState;
  events: EventEnvelope[];
}

export interface CommandValidationResult {
  accepted: boolean;
  reason?: string;
}

export interface CommandApplicationResult {
  state: GameRuntimeState;
  events: EventEnvelope[];
}

export interface CommandContext {
  nowMs: number;
  actorPlayerId: PlayerIdentifier;
}

export interface TurnEngine {
  validate(state: GameRuntimeState, envelope: CommandEnvelope): CommandValidationResult;
  apply(state: GameRuntimeState, envelope: CommandEnvelope, ctx: CommandContext): CommandApplicationResult;
}

export interface BattleEngine {
  validate(state: BattleRuntimeState, envelope: CommandEnvelope): CommandValidationResult;
  apply(state: BattleRuntimeState, envelope: CommandEnvelope, ctx: CommandContext): {
    state: BattleRuntimeState;
    events: EventEnvelope[];
  };
}

export interface BattleIndexStore {
  getActiveBattle(gameId: string, provinceId: ProvinceIdentifier): Promise<BattleReference | null>;
  putActiveBattle(gameId: string, provinceId: ProvinceIdentifier, battle: BattleReference): Promise<void>;
  clearActiveBattle(gameId: string, provinceId: ProvinceIdentifier): Promise<void>;
}

export interface BattleRuntimeStore {
  put(state: BattleRuntimeState): Promise<void>;
  get(battleId: BattleIdentifier): Promise<BattleRuntimeState | null>;
}

export interface EventLogStore {
  append(gameId: string, events: EventEnvelope[]): Promise<void>;
  list(gameId: string, fromSequence: number, limit: number): Promise<EventEnvelope[]>;
}

export interface SnapshotStore {
  put(gameId: string, state: GameRuntimeState): Promise<void>;
  get(gameId: string): Promise<GameRuntimeState | null>;
}

export interface CommandStore {
  put(gameId: string, command: CommandEnvelope): Promise<void>;
  list(gameId: string, fromAction: number, limit: number): Promise<CommandEnvelope[]>;
}

export const currentMode = (phase: GamePhase): TurnMode => phase.kind;
