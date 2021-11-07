// This can be used to augment the game with any derived/calculated fields to save
// them being calculated on the client

import { ProvinceData, ResourceCalculator } from "shared";

const calculator = new ResourceCalculator();

const touchingOwnedWithScanner = (provinceKey: string, owner: string, provinces: any) => {
    return ProvinceData[provinceKey].touching
        .map((key: string) => provinces[key])
        .filter((p: any) => p.owner === owner)
        .find(calculator.hasStructureOfType('SCANNER'));
}

module.exports.removeUnknown = (game: any, userId: string) => {
    // hide information not known by userId
    let user = game.sides[userId];
    delete game.sides;
    game['player'] = user;
    // remove structures and units from non-owned provinces
    var scannableProvinces: any[] = [];
    Object.keys(game.provinces).forEach(key => {
        let province = game.provinces[key];
        let scannable = province.owner === user.owner || touchingOwnedWithScanner(key, user.owner, game.provinces);
        if (!scannable) {
            delete province.walls;
            delete province.roads;
            delete province.units;
            delete province.structures;
        } else {
            scannableProvinces.push(key);
        }
        return province;
    });
    game.scannableProvinces = scannableProvinces;
    return game;
}

