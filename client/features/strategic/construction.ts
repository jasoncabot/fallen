import { StructureCategory, StructureEntityState, UnitIdentifier, UnitValue } from '../../../shared';

export type ConstructionModeKind = 'structure' | 'pending-unit-exit' | 'pending-construction' | 'road' | 'recycle';

export type ConstructionModeCategory = 'ROAD' | 'RECYCLE' | StructureCategory;

export interface ConstructionModelStructure {
    title: string;
    name: string;
    cost: number;
}

export interface ConstructionModelUnit {
    name: string;
    experience: number;
    unitReference: UnitValue;
    unitId: UnitIdentifier;
    container: StructureEntityState;
}

export interface ConstructionMode {
    w: number;
    h: number;
    kind: ConstructionModeKind;
    category?: ConstructionModeCategory;
    model?: ConstructionModelStructure | ConstructionModelUnit;
}
