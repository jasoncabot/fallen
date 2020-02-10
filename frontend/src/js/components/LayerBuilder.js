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
    initialise(province, data, terrain) {

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
            let reference = data.units[unit.kind.category];
            let model = {
                id: unitId,
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
            let reference = data.structures[structure.kind.category];
            // paint column by column to the height in the y-axis
            let displayOffset = reference.display.offset;
            for (let x = 0; x < reference.display.width; x++) {
                for (let y = 0; y < reference.display.height; y++) {
                    let pos = { x: structure.position.x + x, y: structure.position.y + y };
                    let model = {
                        id: structureId,
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
        // TODO: correct tileset
        return this.objectAt(index, [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101], objectExistsAt(this.roads));
    }

    wallAt(index) {
        return this.objectAt(index, [32, 27, 28, 25, 29, 17, 19, 23, 30, 18, 20, 24, 26, 21, 22, 31], objectExistsAt(this.walls));
    }

    wallOverviewAt(index) {
        // TODO: correct tileset
        return this.objectAt(index, [118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118], objectExistsAt(this.walls));
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

    unitCanOccupy(index) {
        // TODO: validation that a unit can occupy this space
        // terrain != water | forest | mountain
        // no unit exists
        // no structure exists
        // no wall exists
        return true;
    }

    structureAt(index) {
        return (this.structureModels[index.x] || [])[index.y];
    }

    validForConstruction(tileIndex) {
        if (tileIndex.x < 0) return false;
        if (tileIndex.y < 0) return false;
        if (tileIndex.y >= this.height) return false;
        if (tileIndex.x >= this.width) return false;
        // TODO: if it's something that can't be 'constructed' hide the cursor
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
