const key = (id) => { return `game-${id}` }

module.exports.findByIdAndUser = async (redis, id, userId) => {
    // load the game
    const game = await this.findById(redis, id);
    // hide information not known by userId
    let user = game.sides[userId];
    delete game.sides;
    game['player'] = user;
    return game;
}

module.exports.findAllByUser = async (redis, userId) => {
    // TODO: when creating a game, store games[user.id] = [...].append(gameId)
    // convert to name + id
    return [{ name: 'First game', date: new Date(), id: '124213' }];
}

module.exports.findById = async (redis, id) => {
    try {
        const value = await redis.getAsync(key(id))
        const game = JSON.parse(value);
        if (!game) {
            throw new Error('Game not found');
        }
        return game;
    } catch (error) {
        throw new Error('Unable to find game with id ' + id);
    }
}

module.exports.create = async (redis, id, game) => {
    const value = JSON.stringify(game, null, 0);
    try {
        return await redis.setAsync(key(id), value);
    } catch (err) {
        throw new Error('Unable to create game with id ' + id);
    }
}

