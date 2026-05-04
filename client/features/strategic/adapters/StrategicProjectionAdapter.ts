import {
    Alliance, Province, ProvinceState, StructureCategory,
    StructureIdentifier, StructureKind, StructureEntityState, StructureState, StructureValue, UnitCategory, UnitIdentifier, UnitEntityState, UnitMovement, UnitValue,
    StrategicCommand,
    TerrainKind,
    findTerrainTileId,
    findTerrainKind
} from '../../../../shared/index';
import { ConstructionModeCategory } from '../construction';
import { StrategicProjectionAdapterPort } from '../ports';


interface UnitBuilder {
    owner: Alliance;
    facing: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    position: { x: number; y: number; };
    hp: number;
    experience: 1 | 2 | 3 | 4;
}


const findObject = <T>(list: T[][]) => {
    return (x: number, y: number): T => {
        return (list[x] || [])[y];
    }
}

const buildUnitModel = (id: string, unit: UnitBuilder, reference: UnitValue) => {
    let model = {
        id: id,
        type: 'unit',
        kind: reference.kind,
        name: reference.kind.name,
        movement: reference.movement,
        upkeep: reference.upkeep,
        experience: unit.experience,
        hp: unit.hp,
        position: unit.position,
        facing: unit.facing,
        owner: unit.owner,
        spritesheet: reference.display.tiles,
        offset: reference.display.offset,
    } as UnitEntityState;
    return model;
}

const buildStructureModel = (id: StructureIdentifier, structure: StructureEntityState, reference: StructureValue, position: { x: number, y: number }, displayOffset: number) => {
    let model = {
        id: id,
        type: 'structure',
        kind: reference.kind,
        category: reference.kind.category,
        hp: {
            current: structure.hp.current,
            max: reference.hp
        },
        units: {
            current: structure.units.current || {},
            max: reference.production.value
        },
        position: position,
        owner: structure.owner,
        state: structure.state,
        spritesheet: reference.display.tiles,
        offset: displayOffset
    } as StructureEntityState;
    return model;
}

export default class StrategicProjectionAdapter implements StrategicProjectionAdapterPort {
    width!: number;
    height!: number;
    provinceOwner!: Alliance;

    structureReferenceLookup!: Record<StructureCategory, StructureValue>;
    unitReferenceLookup!: Record<UnitCategory, UnitValue>;

    structureLookup!: Record<StructureIdentifier, StructureEntityState>;
    unitLookup!: Record<UnitIdentifier, UnitEntityState>;

    // TODO: are these the right types?
    structureModels: Array<Array<StructureEntityState | null>> = [];
    unitModels: Array<Array<UnitEntityState | null>> = []

    roadLookup: { x: number; y: number; }[] = [];
    wallLookup: { x: number; y: number; }[] = [];

    roads: Array<Array<boolean | null>> = [];
    walls: Array<Array<boolean | null>> = [];
    terrainTileAt!: (index: {
        x: number; y: number;
    }) => number;
    terrainAt!: (index: {
        x: number; y: number;
    }) => TerrainKind;

    constructor() {
    }

    // converts a game in a nested format
    // into a set of tiles that can be rendered
    initialise(province: ProvinceState, units: Record<UnitCategory, UnitValue>, structures: Record<StructureCategory, StructureValue>, terrain: Province) {

        this.width = terrain.width();
        this.height = terrain.height();

        this.provinceOwner = province.owner;
        const tileMap = terrain.tiles();

        this.terrainTileAt = (index: { x: number, y: number }) => {
            if (!tileMap) return 9;
            return findTerrainTileId(tileMap, index.x, index.y, 0);
        };

        this.terrainAt = (index: { x: number, y: number }) => {
            const terrainType = terrain.type();
            return findTerrainKind(terrainType, this.terrainTileAt(index));
        };


        this.structureReferenceLookup = structures;
        this.unitReferenceLookup = units;

        this.roadLookup = province.roads || [];
        this.roadLookup.forEach((road) => {
            this.writeTileValue(this.roads, road, true);
        });
        this.wallLookup = province.walls || [];
        this.wallLookup.forEach((wall) => {
            this.writeTileValue(this.walls, wall, true);
        });

        // create unit lookup
        this.unitLookup = province.units || {};
        Object.keys(this.unitLookup).forEach(unitId => {
            let unit = this.unitLookup[unitId];
            let reference = units[unit.kind.category];
            let model = buildUnitModel(unitId, unit, reference);
            this.writeTileValue(this.unitModels, unit.position, model);
        });

        // create structure lookup
        this.structureLookup = province.structures || {};
        Object.keys(this.structureLookup).forEach((structureId: StructureIdentifier) => {
            // Each structure can consist of multiple tiles
            // this is where we turn 1 structure into the many tiles that are 
            // actually rendered on-screen
            let structure = this.structureLookup[structureId];
            let reference = structures[structure.kind.category];
            // paint column by column to the height in the y-axis
            let displayOffset = reference.display.offset;
            for (let x = 0; x < reference.display.width!; x++) {
                for (let y = 0; y < reference.display.height!; y++) {
                    let pos = { x: structure.position.x + x, y: structure.position.y + y };
                    let model = buildStructureModel(structureId, structure, reference, pos, displayOffset);
                    this.writeTileValue(this.structureModels, pos, model);
                    displayOffset += 1;
                }
            }
        });
    }

    roadAt(index: { x: number, y: number }) {
        return this.objectAt(index, [16, 11, 12, 9, 13, 1, 3, 7, 14, 2, 4, 8, 10, 5, 6, 15], findObject(this.roads));
    }

    roadOverviewAt(index: { x: number, y: number }) {
        // 86 - 101
        // up-down-left-right
        // 0000 = 101
        // 0001 = 94
        // 0010 = 94
        // 0011 = 94
        // 0100 = 95
        // 0101 = 86
        // 0110 = 88
        // 0111 = 92
        // 1000 = 95
        // 1001 = 87
        // 1010 = 89
        // 1011 = 93
        // 1100 = 95
        // 1101 = 90
        // 1110 = 91
        // 1111 = 101
        return this.objectAt(index, [101, 94, 94, 94, 95, 86, 88, 92, 95, 87, 89, 93, 95, 90, 91, 101], findObject(this.roads));
    }

    wallAt(index: { x: number, y: number }) {
        return this.objectAt(index, [32, 27, 28, 25, 29, 17, 19, 23, 30, 18, 20, 24, 26, 21, 22, 31], findObject(this.walls));
    }

    wallOverviewAt(index: { x: number, y: number }) {
        return this.objectAt(index, [118, 111, 111, 111, 112, 103, 105, 109, 112, 104, 106, 110, 112, 107, 108, 118], findObject(this.walls));
    }

    structureOverviewAt(index: { x: number, y: number }) {
        let findStructure = findObject(this.structureModels);
        let reference = findStructure(index.x, index.y);
        if (!reference) return null;

        // use the correct colour depending on the owner for the overview tile
        let tileIndexes;
        if (reference.owner === 'HUMAN') {
            tileIndexes = [68, 68, 68, 68, 68, 17, 19, 18, 68, 23, 25, 24, 68, 20, 22, 21];
        } else if (reference.owner === 'NEUTRAL') {
            tileIndexes = [69, 69, 69, 69, 69, 34, 36, 35, 69, 40, 42, 41, 69, 37, 39, 38];
        } else if (reference.owner === 'ALIEN') {
            tileIndexes = [70, 70, 70, 70, 70, 51, 53, 52, 70, 57, 59, 58, 70, 54, 56, 55];
        }
        if (!tileIndexes) return;
        return this.objectAt(index, tileIndexes, (x, y) => {
            let model = findStructure(x, y);
            if (!model) return false;
            return reference.id === model.id;
        });
    }

    unitOverviewAt(index: { x: number, y: number }) {
        // touching units don't matter for the overview
        let findStructure = findObject(this.unitModels);
        let reference = findStructure(index.x, index.y);
        if (!reference) return null;
        const ownerLookup: Record<Alliance, number> = {
            'HUMAN': 0,
            'NEUTRAL': 1,
            'ALIEN': 2
        };
        return ownerLookup[reference.owner];
    }

    objectAt<T>(pos: { x: number, y: number }, tileIds: number[], evaluator: (x: number, y: number) => T) {
        if (!evaluator(pos.x, pos.y)) return undefined;

        // find all touching tiles
        // - | O | -
        // O | X | O
        // - | O | -
        // and create a bitmask - e.g if touching on all sides
        // we create 1111 and not touching anything is 0000
        // <up><down><left><right>
        const offset = (evaluator(pos.x - 0, pos.y - 1) ? 8 : 0)
            | (evaluator(pos.x - 0, pos.y + 1) ? 4 : 0)
            | (evaluator(pos.x - 1, pos.y - 0) ? 2 : 0)
            | (evaluator(pos.x + 1, pos.y - 0) ? 1 : 0);

        // use this unique id to load the correct tile based on it's surroundings
        return tileIds[offset];
    }

    unitAt(index: { x: number, y: number }) {
        return findObject(this.unitModels)(index.x, index.y);
    }

    inBounds(index: { x: number, y: number }, size: { x: number, y: number }) {
        if (index.x < 0) return false;
        if (index.y < 0) return false;
        if (index.y + size.y > this.height) return false;
        if (index.x + size.x > this.width) return false;
        return true;
    }

    unitCanOccupy(movement: UnitMovement, index: { x: number, y: number }) {
        if (!this.inBounds(index, { x: 1, y: 1 })) return false;
        const terrain = this.terrainAt(index);
        const validMovements = {
            "GROUND": ["Bridge", "Plain"],
            "HOVER": ["Bridge", "Plain", "Water"],
        } as Record<UnitMovement, TerrainKind[]>
        if (!validMovements[movement].find(x => x === terrain)) return false;
        if (this.unitAt(index)) return false;
        if (this.structureAt(index)) return false;
        if (this.wallAt(index)) return false;
        return true;
    }

    unitCanDisembark(unitReference: UnitValue, _container: StructureEntityState, index: { x: number, y: number }) {
        // TODO: if in tactical mode, we can only disembark next to the position of the container
        // - check that container.position is next to index.position but not overlapping
        return this.unitCanOccupy(unitReference.movement, index);
    }

    structureAt(index: { x: number, y: number }) {
        return findObject(this.structureModels)(index.x, index.y);
    }

    validForConstruction(index: { x: number, y: number }, size: { x: number, y: number }, category: ConstructionModeCategory) {
        if (!this.inBounds(index, size)) return false;

        // Roads are a special case as they aren't in the structure list
        if (category === 'ROAD') {
            if (this.structureAt(index)) return false;
            if (this.wallAt(index)) return false;
            if (this.roadAt(index)) return false;
            const terrain = this.terrainAt(index);
            if (terrain !== 'Plain') return false;
            if (this.touchingPositions(this.roads, index).length === 1) return false;
            return true;
        }

        if (category === 'RECYCLE') {
            // not all locations can be recycled, there must exist something that
            // isn't just terrain here
            if (this.structureAt(index)) return true;
            if (this.wallAt(index)) return true;
            if (this.roadAt(index)) return true;
            if (this.unitAt(index)) return true;
            return false;
        }

        const reference = this.structureReferenceLookup[category];
        var isAnyTouchingRoad = false;
        var isAnyTouchingWall = false;
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                let pos = { x: index.x + x, y: index.y + y };
                // can't overlap any other structure
                if (this.structureAt(pos)) return false;
                if (this.unitAt(pos)) return false;
                if (this.wallAt(pos)) return false;
                // depending on build type, can't overlap
                if (this.roadAt(pos) && reference.build.placement !== 'ANYWHERE') return false;
                const terrain = this.terrainAt(pos);
                if (terrain !== 'Plain') return false;

                // this finds all tiles surrounding the current tile (and the current tile itself)
                //     X
                //  X  X  X
                //     X
                // surrounding tiles are only counted if they exist in the model array
                // but the current tile is always included, so we check if we have more than 1
                if (!isAnyTouchingRoad && this.touchingPositions(this.roads, pos).length > 1) {
                    isAnyTouchingRoad = true;
                }
                if (!isAnyTouchingWall && this.touchingPositions(this.walls, pos).length > 1) {
                    isAnyTouchingWall = true;
                }
            }
        }
        switch (reference.build.placement) {
            case 'ANYWHERE':
                break;
            case 'B-ROAD':
                if (!isAnyTouchingRoad) return false;
                break;
            case 'B-WALL-OR-ROAD':
                if (!(isAnyTouchingRoad || isAnyTouchingWall)) return false;
                break;
            case 'B-WALL':
                if (!isAnyTouchingWall) return false;
                break;
        }
        return true;
    }

    writeTileValue<T>(dest: Array<Array<T | null>>, position: { x: number, y: number }, value: T | null) {
        let row = dest[position.x];
        if (!row) {
            row = [];
            dest[position.x] = row;
        }
        row[position.y] = value;
    }

    processStrategicCommand(command: StrategicCommand) {
        switch (command.type) {
            case 'STRATEGIC_BUILD_ROAD':
                this.buildRoad(command.at);
                return;
            case 'STRATEGIC_BUILD_WALL':
                this.buildWall(command.at);
                return;
            case 'STRATEGIC_BUILD_STRUCTURE':
                this.buildStructure(command.category, command.at);
                return;
            case 'STRATEGIC_MOVE_UNIT':
                this.moveUnit(this.unitLookup[command.unitId] || null, command.to);
                return;
            case 'STRATEGIC_TURN_UNIT':
                this.turnUnit(this.unitLookup[command.unitId] || null);
                return;
            case 'STRATEGIC_BOARD':
                this.boardUnit(
                    this.unitLookup[command.unitId] || null,
                    command.unitId,
                    this.structureLookup[command.structureId] || null,
                );
                return;
            case 'STRATEGIC_DISEMBARK':
                this.disembarkUnit(
                    command.unitId,
                    command.at,
                    this.structureLookup[command.structureId] || null,
                );
                return;
            case 'STRATEGIC_REPAIR_STRUCTURES':
                this.repairAllStructures();
                return;
            case 'STRATEGIC_DEMOLISH':
                switch (command.targetType) {
                    case 'road':
                        this.demolishRoad(command.at);
                        return;
                    case 'wall':
                        this.demolishWall(command.at);
                        return;
                    case 'structure':
                        this.demolishStructure(
                            this.structureLookup[command.targetId as StructureIdentifier] || null,
                            command.targetId as StructureIdentifier,
                        );
                        return;
                    case 'unit':
                        this.demolishUnit(
                            this.unitLookup[command.targetId as UnitIdentifier] || null,
                            command.targetId as UnitIdentifier,
                        );
                        return;
                }
                return;
            case 'STRATEGIC_INVADE_PROVINCE':
                return;
            default:
                ((_: never) => { })(command);
                return;
        }
    }

    repairAllStructures() {
        Object.keys(this.structureLookup || {}).forEach((structureId) => {
            let instance = this.structureLookup[structureId];
            let reference = this.structureReferenceLookup[instance.kind.category];

            instance.hp.current = instance.hp.max;
        });
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let model = this.structureAt({ x, y });
                if (!model) continue;
                model.hp.current = model.hp.max;
            }
        }
    }

    boardUnit(unit: UnitEntityState | null, unitId: UnitIdentifier, dropship: StructureEntityState | null) {
        if (!unit || !dropship) return;
        dropship.units.current[unitId] = unit;
        this.writeTileValue(this.unitModels, unit.position, null);
        delete this.unitLookup[unitId];
        unit.position = { x: -1, y: -1 };
    }

    disembarkUnit(unitId: UnitIdentifier, position: { x: number; y: number }, container: StructureEntityState | null) {
        if (!container) return;
        const unit = container.units.current[unitId];
        if (!unit) return;
        unit.position = position;
        this.unitLookup[unitId] = unit;
        const reference = this.unitReferenceLookup[unit.kind.category];
        delete container.units.current[unitId];
        let model = buildUnitModel(unitId, unit, reference);
        this.writeTileValue(this.unitModels, position, model);
    }

    moveUnit(target: UnitEntityState | null, position: { x: number; y: number }) {
        if (!target) return;
        let oldPosition = target.position;
        let unit = this.unitAt(oldPosition);
        if (!unit) return;
        this.writeTileValue(this.unitModels, oldPosition, null);
        unit.position = position;
        target.position = unit.position;
        this.writeTileValue(this.unitModels, position, unit);
    }

    turnUnit(target: UnitEntityState | null) {
        if (!target) return;
        let oldPosition = target.position;
        let unit = this.unitAt(oldPosition);
        if (!unit) return;
        if (unit.facing === 7) {
            unit.facing = 0;
        } else {
            unit.facing = (unit.facing + 1) as UnitEntityState['facing'];
        }
        target.facing = unit.facing as UnitEntityState['facing'];
    }

    buildStructure(category: StructureCategory, position: { x: number, y: number }) {
        const structureId: StructureIdentifier = crypto.randomUUID();
        let reference = this.structureReferenceLookup[category];
        const instance: StructureEntityState = {
            id: structureId,
            type: 'structure',
            category: reference.kind.category,
            position: position,
            kind: reference.kind,
            hp: { current: reference.hp, max: reference.hp },
            units: { current: {}, max: reference.production.value },
            owner: this.provinceOwner,
            state: 'UNDER_CONSTRUCTION',
            spritesheet: reference.display.tiles,
            offset: reference.display.offset
        };

        let displayOffset = reference.display.offset;
        for (let x = 0; x < (reference.display.width || 0); x++) {
            for (let y = 0; y < (reference.display.height || 0); y++) {
                let pos = { x: position.x + x, y: position.y + y };
                let model = buildStructureModel(structureId, instance, reference, pos, displayOffset);
                this.writeTileValue(this.structureModels, pos, model);
                displayOffset += 1;
            }
        }
        this.structureLookup[structureId] = instance;
    }

    demolishStructure(structure: StructureEntityState | null, structureId: StructureIdentifier) {
        if (!structure) return;
        let reference = this.structureReferenceLookup[structure.kind.category];
        for (let x = 0; x < reference.display.width!; x++) {
            for (let y = 0; y < reference.display.height!; y++) {
                let pos = { x: structure.position.x + x, y: structure.position.y + y };
                this.writeTileValue(this.structureModels, pos, null);
            }
        }
        delete this.structureLookup[structureId];
    }

    demolishUnit(unit: UnitEntityState | null, unitId: UnitIdentifier) {
        if (!unit) return;
        this.writeTileValue(this.unitModels, unit.position, null);
        delete this.unitLookup[unitId];
    }

    demolishRoad(position: { x: number; y: number }) {
        this.writeTileValue(this.roads, position, null);
        const index = this.roadLookup.findIndex(item => item.x === position.x && item.y === position.y);
        if (index >= 0) this.roadLookup.splice(index, 1);
    }

    demolishWall(position: { x: number; y: number }) {
        this.writeTileValue(this.walls, position, null);
        const index = this.wallLookup.findIndex(item => item.x === position.x && item.y === position.y);
        if (index >= 0) this.wallLookup.splice(index, 1);
    }

    buildRoad(position: { x: number; y: number }) {
        this.writeTileValue(this.roads, position, true);
        this.roadLookup.push(position);
    }

    buildWall(position: { x: number; y: number }) {
        this.writeTileValue(this.walls, position, true);
        this.wallLookup.push(position);
    }

    touchingPositions(models: Array<Array<boolean | null>>, position: { x: number; y: number }) {
        // When building a road, it affects (potentially) all 4 touching tiles
        // so here we just try and find ones that have explicitly been affected
        // so we can be more efficient when re-drawing them
        let positions = [
            { x: position.x - 1, y: position.y + 0 },
            { x: position.x + 1, y: position.y + 0 },
            { x: position.x + 0, y: position.y - 1 },
            { x: position.x + 0, y: position.y + 1 }
        ].filter(pos => {
            return findObject(models)(pos.x, pos.y);
        });
        positions.push(position);
        return positions;
    }
}
