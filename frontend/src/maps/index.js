import aberdeen from './aberdeen.json';
import alma from './alma.json';
import ayden from './ayden.json';
import balkany from './balkany.json';
import brimstone from './brimstone.json';
import bromeLake from './brome-lake.json';
import bromont from './bromont.json';
import canuck from './canuck.json';
import cartasone from './cartasone.json';
import chaos from './chaos.json';
import chertsy from './chertsy.json';
import creedmoor from './creedmoor.json';
import delos from './delos.json';
import eagleNest from './eagle-nest.json';
import elkin from './elkin.json';
import esterel from './esterel.json';
import freeCity from './free-city.json';
import garland from './garland.json';
import granby from './granby.json';
import haven from './haven.json';
import highPoint from './high-point.json';
import hull from './hull.json';
import kamouraska from './kamouraska.json';
import kinabal from './kinabal.json';
import lachine from './lachine.json';
import marshall from './marshall.json';
import massonLake from './masson-lake.json';
import milos from './milos.json';
import norenda from './norenda.json';
import norwood from './norwood.json';
import orford from './orford.json';
import pointHarbour from './point-harbour.json';
import rawdon from './rawdon.json';
import roanoke from './roanoke.json';
import rockCastle from './rock-castle.json';
import rolland from './rolland.json';
import sherbrooke from './sherbrooke.json';
import snakeRiver from './snake-river.json';
import sparta from './sparta.json';
import sutton from './sutton.json';
import thetfordmines from './thetfordmines.json';
import threeRivers from './three-rivers.json';
import valleyfield from './valleyfield.json';
import waterloo from './waterloo.json';

import { ProvinceData, StructureData, TerrainData, UnitData } from 'shared';
import { createTerrainLayer } from '../images/terrain';
import { createStructureLayer } from '../images/structures';
import { createUnitLayer } from '../images/units';

const provinceTerrain = {
    'aberdeen': aberdeen,
    'alma': alma,
    'ayden': ayden,
    'balkany': balkany,
    'brimstone': brimstone,
    'brome-lake': bromeLake,
    'bromont': bromont,
    'canuck': canuck,
    'cartasone': cartasone,
    'chaos': chaos,
    'chertsy': chertsy,
    'creedmoor': creedmoor,
    'delos': delos,
    'eagle-nest': eagleNest,
    'elkin': elkin,
    'esterel': esterel,
    'free-city': freeCity,
    'garland': garland,
    'granby': granby,
    'haven': haven,
    'high-point': highPoint,
    'hull': hull,
    'kamouraska': kamouraska,
    'kinabal': kinabal,
    'lachine': lachine,
    'marshall': marshall,
    'masson-lake': massonLake,
    'milos': milos,
    'norenda': norenda,
    'norwood': norwood,
    'orford': orford,
    'point-harbour': pointHarbour,
    'rawdon': rawdon,
    'roanoke': roanoke,
    'rock-castle': rockCastle,
    'rolland': rolland,
    'sherbrooke': sherbrooke,
    'snake-river': snakeRiver,
    'sparta': sparta,
    'sutton': sutton,
    'thetfordmines': thetfordmines,
    'three-rivers': threeRivers,
    'valleyfield': valleyfield,
    'waterloo': waterloo
};

const buildMapDataForProvince = (scene, key, instance) => {

    const mapData = new Phaser.Tilemaps.MapData({
        tileWidth: 70,
        tileHeight: 36,
        width: 48,
        height: 48,
        orientation: Phaser.Tilemaps.Orientation.ISOMETRIC
    });
    const map = new Phaser.Tilemaps.Tilemap(scene, mapData);
    const reference = ProvinceData[key];

    const terrainLayer = createTerrainLayer(map, reference.type);
    terrainLayer.putTilesAt(provinceTerrain[key], 0, 0);

    const structureLayer = createStructureLayer(map);
    const unitLayer = createUnitLayer(map);

    terrainLayer.setInteractive({
        hitArea: new Phaser.Geom.Polygon([
            // Diamond isometric shape of the terrain
            35, 18,
            36, 18,
            35 + (35 * reference.width), 18 + (18 * reference.width),
            35 + (35 * reference.width) - (35 * reference.height), 19 + (18 * reference.width) + (18 * reference.height),
            35 - (35 * reference.height), 19 + (18 * reference.height),
            35 - (35 * reference.height), 18 + (18 * reference.height)
        ]),
        hitAreaCallback: Phaser.Geom.Polygon.Contains,
        useHandCursor: true,
        draggable: true
    });

    fillStructureLayer(map, structureLayer, instance);
    fillUnitLayer(map, unitLayer, instance);

    return { map, terrain: terrainLayer, structures: structureLayer, units: unitLayer };
}

const fillUnitLayer = (map, unitLayer, provinceInstance) => {
    Object.keys(provinceInstance.units).forEach(unitId => {
        const unitInstance = provinceInstance.units[unitId];
        const unitReference = UnitData[unitInstance.kind.category];
        const idxUnit = map.tilesets.find(x => x.name === unitReference.display.tileset).firstgid;
        unitLayer.putTilesAt(unitReference.display.tiles.map(i => i.map(j => j + idxUnit)), unitInstance.position.x, unitInstance.position.y);
    });
}

const fillStructureLayer = (map, structureLayer, provinceInstance) => {
    const wallAndRoadsBaseOffset = map.tilesets.find(x => x.name === 'infra').firstgid;
    const roadsOffset = 0;
    const wallsOffset = 16;
    const infraOffsets = [16, 11, 12, 9, 13, 1, 3, 7, 14, 2, 4, 8, 10, 5, 6, 15];
    buildTiles(provinceInstance.roads, infraOffsets.map(offset => wallAndRoadsBaseOffset + roadsOffset + offset)).forEach(({ tileId, x, y }) => {
        structureLayer.putTileAt(tileId, x, y);
    });
    buildTiles(provinceInstance.walls, infraOffsets.map(offset => wallAndRoadsBaseOffset + wallsOffset + offset)).forEach(({ tileId, x, y }) => {
        structureLayer.putTileAt(tileId, x, y);
    });
    Object.keys(provinceInstance.structures).forEach(structureId => {
        const structureInstance = provinceInstance.structures[structureId];
        const structureReference = StructureData[structureInstance.kind.category];
        // Each structure can consist of multiple tiles
        // this is where we turn 1 structure into the many tiles that are 
        // actually rendered on-screen
        // paint column by column to the height in the y-axis
        const idxStruct = map.tilesets.find(x => x.name === structureReference.display.tileset).firstgid;
        structureLayer.putTilesAt(structureReference.display.tiles.map(i => i.map(j => j + idxStruct)), structureInstance.position.x, structureInstance.position.y);
    });
}

const buildTiles = (tiles, tileIndexes) => {
    // Convert from set of {x,y} to sparse arrays
    let indexedTiles = [];
    Object.values(tiles || {}).forEach((tile) => {
        writeTileValue(indexedTiles, tile, true);
    });

    return tiles.map(position => {
        return {
            tileId: objectAt(position, tileIndexes, findObject(indexedTiles)),
            x: position.x,
            y: position.y
        }
    });
}

const findObject = (list) => {
    return (x, y) => {
        return (list[x] || [])[y];
    }
}

const writeTileValue = (dest, position, value) => {
    let row = dest[position.x];
    if (!row) {
        row = [];
        dest[position.x] = row;
    }
    row[position.y] = value;
}

const objectAt = (pos, tileIds, evaluator) => {
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

export { buildMapDataForProvince };
