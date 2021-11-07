import alie_si from './alie_si.png';
import alie_ssi from './alie_ssi.png';
import huma_si from './huma_si.png';
import huma_ssi from './huma_ssi.png';
import infra from './infra.png';
import neut_si from './neut_si.png';
import neut_ssi from './neut_ssi.png';

const structureTiles = [
    { key: 'alie_si', numberOfTiles: 77, image: alie_si },
    { key: 'alie_ssi', numberOfTiles: 9, image: alie_ssi },
    { key: 'huma_si', numberOfTiles: 77, image: huma_si },
    { key: 'huma_ssi', numberOfTiles: 9, image: huma_ssi },
    { key: 'infra', numberOfTiles: 33, image: infra },
    { key: 'neut_si', numberOfTiles: 77, image: neut_si },
    { key: 'neut_ssi', numberOfTiles: 9, image: neut_ssi }
];

const preloadStructures = (scene) => {
    structureTiles.forEach(({ key, image }) => {
        scene.load.image(key, image);
    });
}

const createStructureLayer = (map) => {
    let tileCount = map.tilesets.map(s => s.total).reduce((total, acc) => total + acc, 0);
    structureTiles.forEach(({ key, numberOfTiles }) => {
        const set = map.addTilesetImage(key, key, 70, 54, 0, 0, tileCount);
        set.total = numberOfTiles;
        tileCount += numberOfTiles;
    });
    return map.createBlankLayer(map.layers.length, map.tilesets);
}

export { preloadStructures, createStructureLayer };