const key = (id) => { return `game-${id}` }

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

