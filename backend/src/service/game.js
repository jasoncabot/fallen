const maxGames = 10;

const opposite = (side) => { return side === 'HUMAN' ? 'ALIEN' : 'HUMAN' };
module.exports.opposite = opposite;

module.exports.findByIdAndUser = async (redis, id, userId) => {
    // load the game
    const game = await this.findById(redis, id);
    if (!game.sides[userId]) {
        throw new Error('Game for user not found');
    }
    return game;
}

const valueToGameRow = (value) => {
    return JSON.parse(value);
};

const gameRowToValue = (gameRow) => {
    return JSON.stringify(gameRow, null, 0);
}

const gameToValue = (game, userId, date) => {
    return JSON.stringify({
        id: game.id,
        name: game.sides[userId].name,
        date: date,
        kind: game.turn.kind,
        owner: game.turn.owner,
        number: game.turn.number
    }, null, 0);
};

module.exports.findAllByUser = async (redis, userId) => {
    const games = await redis.lrangeAsync(`games-${userId}`, 0, maxGames);
    return games.map(valueToGameRow);
}

module.exports.findById = async (redis, id) => {
    try {
        const value = await redis.getAsync(`game-${id}`)
        const game = JSON.parse(value);
        if (!game) {
            throw new Error('Game not found');
        }
        return game;
    } catch (error) {
        throw new Error('Unable to find game with id ' + id);
    }
}

module.exports.create = async (redis, game, userId) => {
    const gameData = JSON.stringify(game, null, 0);
    const gameRowData = gameToValue(game, userId, new Date());
    try {
        await redis.lpushAsync(`games-${userId}`, gameRowData);
        await redis.ltrimAsync(`games-${userId}`, 0, maxGames - 1);
        await redis.setAsync(`game-${game.id}`, gameData);
        return game.id;
    } catch (err) {
        throw new Error('Unable to create game with id ' + game.id);
    }
}

module.exports.nextTurn = (game) => {

    // TODO: process things that should happen between turns
    // - increment credits / energy / constructions e.t.c

    // update the turn itself
    game.turn.seed = Math.floor(Math.random() * Math.floor(2147483647));
    game.turn.number += 1;
    game.turn.action = 0;
    game.turn.owner = opposite(game.turn.owner);
    game.turn.kind = game.turn.kind; // TODO: check if we need to change to tactical turn

    return game;
}

module.exports.save = async (redis, game) => {

    const gameData = JSON.stringify(game, null, 0);
    try {
        await redis.setAsync(`game-${game.id}`, gameData);
    } catch (e) {
        throw new Error('Unable to save game with id ' + game.id);
    }

    try {
        Object.keys(game.sides).forEach(async userId => {
            const userGamesKey = `games-${userId}`;

            // Go through the list of games for players and move the game with this
            // id to the front of the list and update the date associated with it
            // simplest way to update the (small) list is to just delete and reset

            const games = await redis.lrangeAsync(userGamesKey, 0, maxGames);
            await redis.delAsync(userGamesKey);
            const list = games.map(valueToGameRow)
                .map(g => {
                    if (g.id === game.id) {
                        g.date = new Date();
                        g.kind = game.turn.kind;
                        g.owner = game.turn.owner;
                        g.number = game.turn.number;
                    }
                    return g;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
                .map(gameRowToValue);

            let multi = redis.multi();
            list.forEach(string => {
                multi.rpush(userGamesKey, string);
            });
            await multi.execAsync();
        });
    } catch (e) {
        throw new Error('Unable to update game lists');
    }
}