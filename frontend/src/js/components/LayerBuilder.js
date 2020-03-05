import { TerrainData } from 'shared';

const objectExistsAt = (list) => {
    return (x, y) => {
        return (list[x] || [])[y];
    }
}

export default class LayerBuilder {

    constructor(emitter) {
        this.emitter = emitter;
    }

    // converts a game in a nested format
    // into a set of tiles that can be rendered
    initialise(province, units, structures, terrain) {

        this.width = terrain.width;
        this.height = terrain.height;
        this.terrainTiles = terrain.tiles;

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
            // TODO: simplify and use the province.unit + reference data?
            let model = {
                id: unitId,
                type: 'unit',
                name: reference.kind.name,
                movement: reference.movement,
                upkeep: reference.upkeep,
                experience: unit.experience,
                position: unit.position,
                facing: unit.facing,
                spritesheet: reference.display.tiles,
                offset: reference.display.offset,
            };
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
                    let model = {
                        id: structureId,
                        type: 'structure',
                        position: structure.position,
                        spritesheet: reference.display.tiles,
                        offset: displayOffset
                    };
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
        return this.objectAt(index, [16, 11, 12, 9, 13, 1, 3, 7, 14, 2, 4, 8, 10, 5, 6, 15], objectExistsAt(this.roads));
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
        return this.objectAt(index, [101, 94, 94, 94, 95, 86, 88, 92, 95, 87, 89, 93, 95, 90, 91, 101], objectExistsAt(this.roads));
    }

    wallAt(index) {
        return this.objectAt(index, [32, 27, 28, 25, 29, 17, 19, 23, 30, 18, 20, 24, 26, 21, 22, 31], objectExistsAt(this.walls));
    }

    wallOverviewAt(index) {
        return this.objectAt(index, [118, 111, 111, 111, 112, 103, 105, 109, 112, 104, 106, 110, 112, 107, 108, 118], objectExistsAt(this.walls));
    }

    structureOverviewAt(index) {
        let reference = (this.structureModels[index.x] || [])[index.y];
        if (!reference) return null;
        return this.objectAt(index, [32, 32, 32, 32, 32, 17, 19, 18, 32, 23, 25, 24, 32, 20, 22, 21], (x, y) => {
            let model = (this.structureModels[x] || [])[y];
            if (!model) return false;
            return reference.id === model.id;
        });
    }

    unitOverviewAt(index) {
        // touching units don't matter for the overview
        // we should return 0, 1, 2 depending on owner
        return 0;
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
        return (this.unitModels[index.x] || [])[index.y];
    }

    inBounds(index, size) {
        if (index.x < 0) return false;
        if (index.y < 0) return false;
        if (index.y + size.y > this.height) return false;
        if (index.x + size.x > this.width) return false;
        return true;
    }

    unitCanOccupy(unit, index, terrainType) {
        // TODO: validation that a unit can occupy this space
        if (!this.inBounds(index, { x: 1, y: 1 })) return false;
        // terrain != water | forest | mountain
        let terrain = TerrainData[terrainType][this.terrainAt(index)];
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
        return (this.structureModels[index.x] || [])[index.y];
    }

    validForConstruction(index, size, kind) {
        // TODO: look at kind and check for collisions with units, structures, walls, roads and terrain
        if (!this.inBounds(index, size)) return false;
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
                    // TODO: make the appropriate adjustment to the model
                    case 'road':
                        return;
                    case 'wall':
                        return;
                    case 'structure':
                        return;
                    case 'unit':
                        return;
                }
                return;
            default:
                throw new Error('No handler for action of type ' + command.action);
        }
    }

    moveUnit(target, position) {
        let oldPosition = target.position;
        let unit = this.unitAt(oldPosition);
        this.writeTileValue(this.unitModels, oldPosition, null);
        unit.position = position;
        target.position = unit.position;
        this.writeTileValue(this.unitModels, position, unit);
        this.emitter.emit('unitMoved', unit);
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
        this.emitter.emit('unitTurned', unit);
    }

    buildStructure(kind, position) {
        console.log(`Building ${kind} at ${JSON.stringify(position)}`);
    }

    buildRoad(position) {
        this.writeTileValue(this.roads, position, true);
        this.roadLookup.push(position);

        // When building a road, it affects (potentially) all 4 touching tiles
        // so here we just try and find ones that have explicitly been affected
        // so we can be more efficient when re-drawing them
        let positions = [
            { x: position.x - 1, y: position.y + 0 },
            { x: position.x + 1, y: position.y + 0 },
            { x: position.x + 0, y: position.y - 1 },
            { x: position.x + 0, y: position.y + 1 }
        ].filter(pos => {
            return (this.roads[pos.x] || [])[pos.y];
        });
        positions.push(position);
        this.emitter.emit('roadsUpdated', positions.map(pos => {
            let { x, y } = pos;
            var tileId = this.roadAt(pos);
            return { x, y, tileId };
        }));
    }

    buildWall(position) {
        this.writeTileValue(this.walls, position, true);
        this.wallLookup.push(position);

        let positions = [
            { x: position.x - 1, y: position.y + 0 },
            { x: position.x + 1, y: position.y + 0 },
            { x: position.x + 0, y: position.y - 1 },
            { x: position.x + 0, y: position.y + 1 }
        ].filter(pos => {
            return (this.walls[pos.x] || [])[pos.y];
        });
        positions.push(position);
        this.emitter.emit('wallsUpdated', positions.map(pos => {
            let { x, y } = pos;
            var tileId = this.wallAt(pos);
            return { x, y, tileId };
        }));
    }

}
