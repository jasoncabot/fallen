// This can be used to augment the game with any derived/calculated fields to save
// them being calculated on the client

const touchingOwnedWithScanner = (province, owner, provinces) => {
    // TODO: something like the following
    //     - need to put touching into the shared library
    //     - need to ensure scanners have a well defined category not tied to human/alien
    // return province.touching
    //     .map(key => provinces[key])
    //     .filter(p => p.owner === owner)
    //     .find(p => p.structures.find(s => s.kind.category === 'arad'));
    return true;
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
        // TODO: do we own a province with a scanner, touching this province?
        let scannable = province.owner === user.owner || touchingOwnedWithScanner(province, user.owner, game.provinces);
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

