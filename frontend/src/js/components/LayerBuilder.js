import { TerrainData } from 'shared';

const uuidv4 = require('uuid/v4');

const findObject = (list) => {
    return (x, y) => {
        return (list[x] || [])[y];
    }
}

const buildUnitModel = (id, unit, reference) => {
    let model = {
        id: id,
        type: 'unit',
        name: reference.kind.name,
        movement: reference.movement,
        upkeep: reference.upkeep,
        experience: unit.experience,
        position: unit.position,
        facing: unit.facing,
        owner: unit.owner,
        spritesheet: reference.display.tiles,
        offset: reference.display.offset,
    };
    return model;
}

const buildStructureModel = (id, structure, reference, position, displayOffset) => {
    let model = {
        id: id,
        type: 'structure',
        kind: structure.kind.type,
        category: structure.kind.category,
        hp: {
            current: structure.hp,
            max: reference.hp
        },
        units: {
            current: structure.units || {},
            max: reference.production.value
        },
        position: position,
        owner: structure.owner,
        state: structure.state,
        spritesheet: reference.display.tiles,
        offset: displayOffset
    };
    return model;
}

export default class LayerBuilder {

    constructor(emitter) {
        if (emitter) {
            emitter.on('commandSubmitted', this.processCommand, this);
        }
        this.emitter = emitter;

        // default callbacks
        this.unitBoarded = (_id) => { };
        this.unitDemolished = (_id) => { };
        this.unitMoved = (_unit) => { };
        this.unitTurned = (_unit) => { };
        this.structureBuilt = (_models) => { };
        this.structureDemolished = (_id) => { };
        this.structuresRepaired = () => { };
        this.roadsUpdated = (_roads) => { };
        this.wallsUpdated = (_walls) => { };
    }

    shutdown() {
        this.emitter.removeListener('commandSubmitted', this.processCommand, this);
        this.emitter = null;
    }

    // converts a game in a nested format
    // into a set of tiles that can be rendered
    initialise(province, units, structures, terrain) {

        this.width = terrain.width;
        this.height = terrain.height;
        this.terrainType = terrain.type;
        this.terrainTiles = terrain.tiles;
        this.provinceOwner = province.owner;

        this.structureReferenceLookup = structures;
        this.unitReferenceLookup = units;

        this.roads = [];
        this.roadLookup = province.roads;
        Object.values(province.roads || {}).forEach((road) => {
            this.writeTileValue(this.roads, road, true);
        });
        this.walls = [];
        this.wallLookup = province.walls;
        Object.values(province.walls || {}).forEach((wall) => {
            this.writeTileValue(this.walls, wall, true);
        });

        // create unit lookup
        this.unitModels = [];
        this.unitLookup = province.units;
        Object.keys(this.unitLookup || {}).forEach(unitId => {
            let unit = this.unitLookup[unitId];
            let reference = units[unit.kind.category];
            let model = buildUnitModel(unitId, unit, reference);
            this.writeTileValue(this.unitModels, unit.position, model);
        });

        // create structure lookup
        this.structureModels = [];
        this.structureLookup = province.structures;

        Object.keys(this.structureLookup || {}).forEach((structureId) => {
            // Each structure can consist of multiple tiles
            // this is where we turn 1 structure into the many tiles that are 
            // actually rendered on-screen
            let structure = this.structureLookup[structureId];
            let reference = structures[structure.kind.category];
            // paint column by column to the height in the y-axis
            let displayOffset = reference.display.offset;
            for (let x = 0; x < reference.display.width; x++) {
                for (let y = 0; y < reference.display.height; y++) {
                    let pos = { x: structure.position.x + x, y: structure.position.y + y };
                    let model = buildStructureModel(structureId, structure, reference, pos, displayOffset);
                    this.writeTileValue(this.structureModels, pos, model);
                    displayOffset += 1;
                }
            }
        });
    }

    terrainAt(index) {
        return this.terrainTiles[index.x][index.y];
    }

    roadAt(index) {
        return this.objectAt(index, [16, 11, 12, 9, 13, 1, 3, 7, 14, 2, 4, 8, 10, 5, 6, 15], findObject(this.roads));
    }

    roadOverviewAt(index) {
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

    wallAt(index) {
        return this.objectAt(index, [32, 27, 28, 25, 29, 17, 19, 23, 30, 18, 20, 24, 26, 21, 22, 31], findObject(this.walls));
    }

    wallOverviewAt(index) {
        return this.objectAt(index, [118, 111, 111, 111, 112, 103, 105, 109, 112, 104, 106, 110, 112, 107, 108, 118], findObject(this.walls));
    }

    structureOverviewAt(index) {
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
        return this.objectAt(index, tileIndexes, (x, y) => {
            let model = findStructure(x, y);
            if (!model) return false;
            return reference.id === model.id;
        });
    }

    unitOverviewAt(index) {
        // touching units don't matter for the overview
        let findStructure = findObject(this.unitModels);
        let reference = findStructure(index.x, index.y);
        if (!reference) return null;
        return {
            'HUMAN': 0,
            'NEUTRAL': 1,
            'ALIEN': 2
        }[reference.owner];
    }

    objectAt(pos, tileIds, evaluator) {
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

    unitAt(index) {
        return findObject(this.unitModels)(index.x, index.y);
    }

    inBounds(index, size) {
        if (index.x < 0) return false;
        if (index.y < 0) return false;
        if (index.y + size.y > this.height) return false;
        if (index.x + size.x > this.width) return false;
        return true;
    }

    unitCanOccupy(unit, index) {
        if (!this.inBounds(index, { x: 1, y: 1 })) return false;
        const terrain = TerrainData[this.terrainType][this.terrainAt(index)];
        const validMovements = {
            "GROUND": ["Bridge", "Plain"],
            "HOVER": ["Bridge", "Plain", "Water"],
        }
        if (!validMovements[unit.movement].find(x => x === terrain)) return false;
        if (this.unitAt(index)) return false;
        if (this.structureAt(index)) return false;
        if (this.wallAt(index)) return false;
        return true;
    }

    structureAt(index) {
        return findObject(this.structureModels)(index.x, index.y);
    }

    validForConstruction(index, size, category) {
        if (!this.inBounds(index, size)) return false;

        // Roads are a special case as they aren't in the structure list
        if (category === 'ROAD') {
            if (this.structureAt(index)) return false;
            if (this.wallAt(index)) return false;
            if (this.roadAt(index)) return false;
            const terrain = TerrainData[this.terrainType][this.terrainAt(index)];
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
        for (let x = 0; x < reference.display.width; x++) {
            for (let y = 0; y < reference.display.height; y++) {
                let pos = { x: index.x + x, y: index.y + y };
                // can't overlap any other structure
                if (this.structureAt(pos)) return false;
                if (this.unitAt(pos)) return false;
                if (this.wallAt(pos)) return false;
                const terrain = TerrainData[this.terrainType][this.terrainAt(pos)];
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

    writeTileValue(dest, position, value) {
        let row = dest[position.x];
        if (!row) {
            row = [];
            dest[position.x] = row;
        }
        row[position.y] = value;
    }

    findTarget(command) {
        let type = command.targetType;
        if (type === 'unit') {
            return this.unitLookup[command.targetId];
        } else if (type === 'structure') {
            return this.structureLookup[command.targetId];
        }
        return null;
    }

    processCommand(command) {
        // This makes no attempt to validate the command, that should have already been done
        switch (command.action) {
            case 'ROAD':
                this.buildRoad(command.position);
                return;
            case 'WALL':
                this.buildWall(command.position);
                return;
            case 'TURN':
                this.turnUnit(this.findTarget(command));
                return;
            case 'MOVE':
                this.moveUnit(this.findTarget(command), command.position);
                return;
            case 'BUILD_STRUCTURE':
                this.buildStructure(command.category, command.position);
                return;
            case 'DEMOLISH':
                switch (command.targetType) {
                    case 'road':
                        this.demolishRoad(command.position);
                        return;
                    case 'wall':
                        this.demolishWall(command.position);
                        return;
                    case 'structure':
                        this.demolishStructure(this.findTarget(command), command.targetId);
                        return;
                    case 'unit':
                        this.demolishUnit(this.findTarget(command), command.targetId);
                        return;
                }
                return;
            case 'LAUNCH_DROPSHIP':
                this.launchDropship(this.findTarget(command), command.targetId);
                return;
            case 'BOARD':
                const unit = this.findTarget(command);
                const dropship = this.findTarget({
                    targetId: command.dropship,
                    targetType: 'structure'
                });
                this.boardUnit(unit, command.targetId, dropship);
                return;
            case 'REPAIR':
                this.repairAllStructures();
                return;
            case 'ADJUST_RESEARCH':
                return;
            default:
                throw new Error('No handler for action of type ' + command.action);
        }
    }

    repairAllStructures() {
        Object.keys(this.structureLookup || {}).forEach((structureId) => {
            let instance = this.structureLookup[structureId];
            let reference = this.structureReferenceLookup[instance.kind.category];

            instance.hp = reference.hp;
        });
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let model = this.structureAt({ x, y });
                if (!model) continue;
                model.hp.current = model.hp.max;
            }
        }

        this.structuresRepaired();
    }

    launchDropship(dropship, identifier) {
        this.demolishStructure(dropship, identifier);
    }

    boardUnit(unit, unitId, dropship) {
        dropship.units[unitId] = unit;
        this.writeTileValue(this.unitModels, unit.position, null);
        delete this.unitLookup[unitId];
        unit.position = {};
        this.unitBoarded(unitId);
    }

    moveUnit(target, position) {
        let oldPosition = target.position;
        let unit = this.unitAt(oldPosition);
        this.writeTileValue(this.unitModels, oldPosition, null);
        unit.position = position;
        target.position = unit.position;
        this.writeTileValue(this.unitModels, position, unit);
        this.unitMoved(unit);
    }

    turnUnit(target) {
        let oldPosition = target.position;
        let unit = this.unitAt(oldPosition);
        if (unit.facing === 7) {
            unit.facing = 0;
        } else {
            unit.facing += 1;
        }
        target.facing = unit.facing;
        this.unitTurned(unit);
    }

    buildStructure(category, position) {
        const structureId = uuidv4();
        let reference = this.structureReferenceLookup[category];
        const instance = {
            position: position,
            kind: reference.kind,
            hp: reference.hp,
            units: {},
            owner: this.provinceOwner,
            state: 'UNDER_CONSTRUCTION'
        };

        let models = [];
        let displayOffset = reference.display.offset;
        for (let x = 0; x < reference.display.width; x++) {
            for (let y = 0; y < reference.display.height; y++) {
                let pos = { x: position.x + x, y: position.y + y };
                let model = buildStructureModel(structureId, instance, reference, pos, displayOffset);
                this.writeTileValue(this.structureModels, pos, model);
                displayOffset += 1;
                models.push(model);
            }
        }
        this.structureLookup[structureId] = instance;
        this.structureBuilt(models);
    }

    demolishStructure(structure, structureId) {
        let reference = this.structureReferenceLookup[structure.kind.category];
        for (let x = 0; x < reference.display.width; x++) {
            for (let y = 0; y < reference.display.height; y++) {
                let pos = { x: structure.position.x + x, y: structure.position.y + y };
                this.writeTileValue(this.structureModels, pos, null);
            }
        }
        delete this.structureLookup[structureId];
        this.structureDemolished(structureId, structure.position);
    }

    demolishUnit(unit, unitId) {
        this.writeTileValue(this.unitModels, unit.position, null);
        delete this.unitLookup[unitId];
        this.unitDemolished(unitId, unit.position);
    }

    demolishRoad(position) {
        this.writeTileValue(this.roads, position, null);
        const index = this.roadLookup.findIndex(item => item.x === position.x && item.y === position.y);
        if (index >= 0) this.roadLookup.splice(index, 1);
        let positions = this.touchingPositions(this.roads, position);
        this.roadsUpdated(positions.map(pos => {
            let { x, y } = pos;
            var tileId = this.roadAt(pos);
            return { x, y, tileId };
        }));
    }

    demolishWall(position) {
        this.writeTileValue(this.walls, position, null);
        const index = this.wallLookup.findIndex(item => item.x === position.x && item.y === position.y);
        if (index >= 0) this.wallLookup.splice(index, 1);
        let positions = this.touchingPositions(this.walls, position);
        this.wallsUpdated(positions.map(pos => {
            let { x, y } = pos;
            var tileId = this.wallAt(pos);
            return { x, y, tileId };
        }));
    }

    buildRoad(position) {
        this.writeTileValue(this.roads, position, true);
        this.roadLookup.push(position);
        let positions = this.touchingPositions(this.roads, position);
        this.roadsUpdated(positions.map(pos => {
            let { x, y } = pos;
            var tileId = this.roadAt(pos);
            return { x, y, tileId };
        }));
    }

    buildWall(position) {
        this.writeTileValue(this.walls, position, true);
        this.wallLookup.push(position);
        let positions = this.touchingPositions(this.walls, position);
        this.wallsUpdated(positions.map(pos => {
            let { x, y } = pos;
            var tileId = this.wallAt(pos);
            return { x, y, tileId };
        }));
    }

    touchingPositions(models, position) {
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
