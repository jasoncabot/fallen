import { StructureData, TerrainData } from ".";

class ProvinceIndexer {
    reference: any;
    instance: any;

    constructor(reference, instance) {
        this.reference = reference;
        this.instance = instance;
    }

    inBounds(index, size) {
        if (index.x < 0) return false;
        if (index.y < 0) return false;
        if (index.y + size.y > this.reference.height) return false;
        if (index.x + size.x > this.reference.width) return false;
        return true;
    }

    unitCanDisembark(unitReference, container, index) {
        // TODO: if in tactical mode, we can only disembark next to the position of the container
        // - check that container.position is next to index.position but not overlapping
        return this.unitCanOccupy(unitReference.movement, index);
    }

    validForConstruction(index, size, category) {
        if (!this.inBounds(index, size)) return false;

        // Roads are a special case as they aren't in the structure list
        if (category === 'ROAD') {
            if (this.structureAt(index)) return false;
            if (this.wallAt(index)) return false;
            if (this.roadAt(index)) return false;
            const terrain = TerrainData[this.reference.type][this.terrainAt(index)];
            if (terrain !== 'Plain') return false;
            if (this.touchingPositions(this.instance.roads, index).length === 1) return false;
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

        const reference = StructureData[category];
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
                const terrain = TerrainData[this.reference.type][this.terrainAt(pos)];
                if (terrain !== 'Plain') return false;

                // this finds all tiles surrounding the current tile (and the current tile itself)
                //     X
                //  X  X  X
                //     X
                // surrounding tiles are only counted if they exist in the model array
                // but the current tile is always included, so we check if we have more than 1
                if (!isAnyTouchingRoad && this.touchingPositions(this.instance.roads, pos).length > 1) {
                    isAnyTouchingRoad = true;
                }
                if (!isAnyTouchingWall && this.touchingPositions(this.instance.walls, pos).length > 1) {
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
            return this.findObject(models)(pos.x, pos.y);
        });
        positions.push(position);
        return positions;
    }

    unitCanOccupy(movement, index) {
        if (!this.inBounds(index, { x: 1, y: 1 })) return false;
        const terrain = TerrainData[this.reference.type][this.terrainAt(index)];
        const validMovements = {
            "GROUND": ["Bridge", "Plain"],
            "HOVER": ["Bridge", "Plain", "Water"],
        }
        if (!validMovements[movement].find(x => x === terrain)) return false;
        if (this.unitAt(index)) return false;
        if (this.structureAt(index)) return false;
        if (this.wallAt(index)) return false;
        return true;
    }


    terrainAt(index) {
        return 0;
        // return this.terrainTiles[index.x][index.y];
    }

    roadAt(index) {
        return false; // TODO: look through instance data for road at index.x, index.y
    }

    unitAt(index) {
        return false; // TODO: look through instance data for unit at index.x, index.y
    }

    structureAt(index) {
        return false; // TODO: look through instance data for structure at index.x, index.y
    }

    wallAt(index) {
        return false; // TODO: look through instance data for wall at index.x, index.y
    }

    findObject(list) {
        return (x, y) => {
            return (list[x] || [])[y];
        }
    }

}

export { ProvinceIndexer };