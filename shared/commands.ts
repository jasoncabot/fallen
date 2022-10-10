import { PlayerIdentifier, StructureIdentifier, TurnMode, UnitIdentifier } from './game';
import { StructureCategory } from './structures';

export type ProvinceIdentifier = string;
export type BattleIdentifier = string;

export type CommandIdentifier = string;

export interface CommandEnvelope<TCommand extends GameCommand = GameCommand> {
  commandId: CommandIdentifier;
  gameId: string;
  // Tactical commands may be routed to a BattleDO while still belonging to the same game timeline.
  battleId?: BattleIdentifier;
  scope: 'GAME' | 'BATTLE';
  actorPlayerId: PlayerIdentifier;
  turnNumber: number;
  expectedAction: number;
  mode: TurnMode;
  issuedAtMs: number;
  command: TCommand;
}

export type GameCommand = StrategicCommand | TacticalCommand | SharedCommand;

export type SharedCommand = EndTurnCommand;

export interface EndTurnCommand {
  type: 'END_TURN';
}

export type StrategicCommand =
  | StrategicMoveUnitCommand
  | StrategicTurnUnitCommand
  | StrategicBuildRoadCommand
  | StrategicBuildWallCommand
  | StrategicBuildStructureCommand
  | StrategicDemolishCommand
  | StrategicBoardCommand
  | StrategicDisembarkCommand
  | StrategicRepairCommand
  | StrategicInvadeProvinceCommand;

export interface StrategicMoveUnitCommand {
  type: 'STRATEGIC_MOVE_UNIT';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  to: { x: number; y: number };
}

export interface StrategicTurnUnitCommand {
  type: 'STRATEGIC_TURN_UNIT';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
}

export interface StrategicBuildRoadCommand {
  type: 'STRATEGIC_BUILD_ROAD';
  provinceId: ProvinceIdentifier;
  at: { x: number; y: number };
}

export interface StrategicBuildWallCommand {
  type: 'STRATEGIC_BUILD_WALL';
  provinceId: ProvinceIdentifier;
  at: { x: number; y: number };
}

export interface StrategicBuildStructureCommand {
  type: 'STRATEGIC_BUILD_STRUCTURE';
  provinceId: ProvinceIdentifier;
  category: StructureCategory;
  at: { x: number; y: number };
}

export interface StrategicDemolishCommand {
  type: 'STRATEGIC_DEMOLISH';
  provinceId: ProvinceIdentifier;
  targetType: 'unit' | 'structure' | 'road' | 'wall';
  targetId: string;
  at: { x: number; y: number };
}

export interface StrategicBoardCommand {
  type: 'STRATEGIC_BOARD';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  structureId: StructureIdentifier;
}

export interface StrategicDisembarkCommand {
  type: 'STRATEGIC_DISEMBARK';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  structureId: StructureIdentifier;
  at: { x: number; y: number };
}

export interface StrategicRepairCommand {
  type: 'STRATEGIC_REPAIR_STRUCTURES';
  provinceId: ProvinceIdentifier;
}

export interface StrategicInvadeProvinceCommand {
  type: 'STRATEGIC_INVADE_PROVINCE';
  fromProvinceId: ProvinceIdentifier;
  toProvinceId: ProvinceIdentifier;
  attackerUnitIds: UnitIdentifier[];
}

export type TacticalCommand =
  | TacticalMoveUnitCommand
  | TacticalAttackUnitCommand
  | TacticalAttackStructureCommand
  | TacticalUseStructureActionCommand
  | TacticalRetreatCommand;

export interface TacticalMoveUnitCommand {
  type: 'TACTICAL_MOVE_UNIT';
  provinceId: ProvinceIdentifier;
  unitId: UnitIdentifier;
  to: { x: number; y: number };
}

export interface TacticalAttackUnitCommand {
  type: 'TACTICAL_ATTACK_UNIT';
  provinceId: ProvinceIdentifier;
  attackerUnitId: UnitIdentifier;
  targetUnitId: UnitIdentifier;
  weapon: 'LIGHT' | 'HEAVY';
}

export interface TacticalAttackStructureCommand {
  type: 'TACTICAL_ATTACK_STRUCTURE';
  provinceId: ProvinceIdentifier;
  attackerUnitId: UnitIdentifier;
  targetStructureId: StructureIdentifier;
  weapon: 'LIGHT' | 'HEAVY';
}

export interface TacticalUseStructureActionCommand {
  type: 'TACTICAL_USE_STRUCTURE_ACTION';
  provinceId: ProvinceIdentifier;
  structureId: StructureIdentifier;
  action: 'FIRE' | 'MISSILE';
  target: { x: number; y: number };
}

export interface TacticalRetreatCommand {
  type: 'TACTICAL_RETREAT';
  provinceId: ProvinceIdentifier;
}
