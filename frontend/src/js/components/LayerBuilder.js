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
        Object.values(province.roads).forEach((road) => {
            this.writeTileValue(this.roads, road, true);
        });
        this.walls = [];
        Object.values(province.walls).forEach((wall) => {
            this.writeTileValue(this.walls, wall, true);
        });

        // create unit image lookup
        this.unitImages = [];
        Object.values(province.units).forEach((unit) => {
            let reference = data.units[unit.kind.category];
            let displayOffset = reference.display.offset + unit.facing;
            this.writeTile(this.unitImages, { x: unit.position.x, y: unit.position.y },
                reference.display.tiles, displayOffset);
        });

        // create structure image lookup
        this.structureImages = [];
        Object.values(province.structures).forEach((structure) => {
            // Each structure can consist of multiple tiles
            // this is where we turn 1 structure into the many tiles that are 
            // actually rendered on-screen
            let reference = data.structures[structure.kind.category];
            // paint column by column to the height in the y-axis
            let displayOffset = reference.display.offset;
            for (let x = 0; x < reference.display.width; x++) {
                for (let y = 0; y < reference.display.height; y++) {
                    let pos = { x: structure.position.x + x, y: structure.position.y + y };
                    this.writeTile(this.structureImages, pos, reference.display.tiles, displayOffset);
                    displayOffset += 1;
                }
            }
        });
    }

    terrainAt(index) {
        return this.terrainTiles[index.x][index.y];
    }

    roadAt(index) {
        return this.objectAt(index, this.roads, [16, 11, 12, 9, 13, 1, 3, 7, 14, 2, 4, 8, 10, 5, 6, 15]);
    }

    wallAt(index) {
        return this.objectAt(index, this.walls, [32, 27, 28, 25, 29, 17, 19, 23, 30, 18, 20, 24, 26, 21, 22, 31]);
    }

    objectAt(pos, list, tileIds) {
        const objectExistsAt = (x, y) => {
            return (list[x] || [])[y];
        }
        if (!objectExistsAt(pos.x, pos.y)) return undefined;

        // find all touching tiles
        // - | O | -
        // O | X | O
        // - | O | -
        // and create a bitmask - e.g if touching on all sides
        // we create 1111 and not touching anything is 0000
        const offset = (objectExistsAt(pos.x - 0, pos.y - 1) ? 8 : 0)
            | (objectExistsAt(pos.x - 0, pos.y + 1) ? 4 : 0)
            | (objectExistsAt(pos.x - 1, pos.y - 0) ? 2 : 0)
            | (objectExistsAt(pos.x + 1, pos.y - 0) ? 1 : 0);

        // use this unique id to load the correct tile based on it's surroundings
        return tileIds[offset];
    }

    unitAt(index) {
        return (this.unitImages[index.x] || [])[index.y];
    }

    structureAt(index) {
        return (this.structureImages[index.x] || [])[index.y];
    }

    validForConstruction(tileIndex) {
        if (tileIndex.x < 0) return false;
        if (tileIndex.y < 0) return false;
        if (tileIndex.y >= this.height) return false;
        if (tileIndex.x >= this.width) return false;
        // TODO: if it's something that can't be 'constructed' hide the cursor
        return true;
    }

    writeTile(dest, position, spritesheet, index) {
        this.writeTileValue(dest, position, { spritesheet, name: "" + index });
    }

    writeTileValue(dest, position, value) {
        let row = dest[position.x];
        if (!row) {
            row = [];
            dest[position.x] = row;
        }
        row[position.y] = value;
    }

    buildRoad(position) {
        this.writeTileValue(this.roads, position, true);

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

}
