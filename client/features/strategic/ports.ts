import {
    CommandEnvelope,
    Province,
    ProvinceState,
    StrategicCommand,
    StructureCategory,
    StructureEntityState,
    StructureIdentifier,
    StructureValue,
    UnitCategory,
    UnitEntityState,
    UnitIdentifier,
    UnitMovement,
    UnitValue,
} from '../../../shared';
import { ConstructionModeCategory } from './construction';

export interface SubmitCommandResult {
    accepted: boolean;
    reason?: string;
    sequence?: number;
}

export interface StrategicCommandTransport {
    submitCommand(gameId: string, envelope: CommandEnvelope<StrategicCommand>): Promise<SubmitCommandResult>;
}

export interface StrategicRuntimeCommandContext {
    gameId: string;
    actorPlayerId: string;
    turnNumber: number;
    expectedAction: number;
}

export interface StrategicRuntimeCallbacks {
    onOptimisticCommand?: (command: StrategicCommand, envelope: CommandEnvelope<StrategicCommand>) => void;
    onPlaySound?: (sound: string) => void;
}

export interface StrategicProjectionAdapterPort {
    width: number;
    height: number;
    unitLookup: Record<UnitIdentifier, UnitEntityState>;
    initialise(
        province: ProvinceState,
        units: Record<UnitCategory, UnitValue>,
        structures: Record<StructureCategory, StructureValue>,
        terrain: Province,
    ): void;
    processStrategicCommand(command: StrategicCommand): void;
    terrainTileAt(index: { x: number; y: number }): number;
    terrainAt(index: { x: number; y: number }): string;
    roadAt(index: { x: number; y: number }): number | undefined;
    wallAt(index: { x: number; y: number }): number | undefined;
    unitAt(index: { x: number; y: number }): UnitEntityState | null;
    structureAt(index: { x: number; y: number }): StructureEntityState | null;
    roadOverviewAt(index: { x: number; y: number }): number | undefined;
    wallOverviewAt(index: { x: number; y: number }): number | undefined;
    structureOverviewAt(index: { x: number; y: number }): number | null | undefined;
    unitOverviewAt(index: { x: number; y: number }): number | null;
    unitCanOccupy(movement: UnitMovement, index: { x: number; y: number }): boolean;
    unitCanDisembark(unitReference: UnitValue, container: StructureEntityState, index: { x: number; y: number }): boolean;
    validForConstruction(index: { x: number; y: number }, size: { x: number; y: number }, category: ConstructionModeCategory): boolean;
}
