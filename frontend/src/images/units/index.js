import alie_ui from './alie_ui.png';
import huma_ui from './huma_ui.png';
import neut_ui from './neut_ui.png';

const unitTiles = [
    { key: 'alie_ui', numberOfTiles: 89, image: alie_ui },
    { key: 'huma_ui', numberOfTiles: 89, image: huma_ui },
    { key: 'neut_ui', numberOfTiles: 40, image: neut_ui }
];

const preloadUnits = (scene) => {
    unitTiles.forEach(({ key, image }) => {
        scene.load.image(key, image);
    });
}

const createUnitLayer = (map) => {
    let tileCount = map.tilesets.map(s => s.total).reduce((total, acc) => total + acc, 0);
    unitTiles.forEach(({ key, numberOfTiles }) => {
        const set = map.addTilesetImage(key, key, 70, 54, 0, 0, tileCount);
        set.total = numberOfTiles;
        tileCount += numberOfTiles;
    });
    return map.createBlankLayer(map.layers.length, map.tilesets);
}

export { preloadUnits, createUnitLayer };
