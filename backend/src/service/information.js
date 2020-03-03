// This can be used to augment the game with any derived/calculated fields to save
// them being calculated on the client

const ProvinceData = require('shared/provinces');

const touchingOwnedWithScanner = (provinceKey, owner, provinces) => {
    return ProvinceData[provinceKey].touching
        .map(key => provinces[key])
        .filter(p => p.owner === owner)
        .find(p => Object.values(p.structures).find(s => s.kind.scanner));
}

module.exports.removeUnknown = (game, userId) => {
    // hide information not known by userId
    let user = game.sides[userId];
    delete game.sides;
    game['player'] = user;
    // remove structures and units from non-owned provinces
    var scannableProvinces = [];
    Object.keys(game.provinces).forEach(key => {
        let province = game.provinces[key];
        let scannable = province.owner === user.owner || touchingOwnedWithScanner(key, user.owner, game.provinces);
        if (!scannable) {
            delete province.walls;
            delete province.roads;
            delete province.units;
            delete province.structures;
            delete province.energy;
            delete province.credits;
            delete province.research;
        } else {
            scannableProvinces.push(key);
        }
        return province;
    });
    game.scannableProvinces = scannableProvinces;
    return game;
}

