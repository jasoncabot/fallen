import { ProvinceData } from 'shared';

import desertOverview from './desert-overview.png';
import desert from './desert.png';
import forestOverview from './forest-overview.png';
import forest from './forest.png';
import overlay from './overlay-overview.png';
import rockyOverview from './rocky-overview.png';
import rocky from './rocky.png';

const preloadTerrainForProvince = (scene, province) => {
    const terrain = ProvinceData[province].type;

    const lookup = {
        desert: {
            isometric: desert,
            overview: desertOverview
        },
        forest: {
            isometric: forest,
            overview: forestOverview
        },
        rocky: {
            isometric: rocky,
            overview: rockyOverview
        },
        overlay
    };

    scene.load.image('overlay-overview', lookup.overlay);
    scene.load.image(`${terrain}`, lookup[terrain].isometric);
    scene.load.image(`${terrain}-overview`, lookup[terrain].overview);
};

const createTerrainLayer = (map, type) => {
    const totals = { 'forest': 134, 'desert': 141, 'rocky': 124 };
    const firstgid = map.tilesets.map(s => s.total).reduce((total, acc) => total + acc, 0);
    const terrain = map.addTilesetImage(type, type, 70, 54, 0, 0, firstgid);
    terrain.total = totals[type];
    return map.createBlankLayer(0, map.tilesets);
}

export { preloadTerrainForProvince, createTerrainLayer };