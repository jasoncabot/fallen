const MAX_GAMES = 10;

import { GameDetails, GameRow, opposite, GameID } from 'shared';
import { UserID } from '../index.interface';

const findByIdAndUser = async (redis: any, gameId: GameID, userId: UserID) => {
    const game = await findById(redis, gameId);
    if (!game.sides[userId]) {
        throw new Error('Game for user not found');
    }
    return game;
}

const findAllByUser = async (redis: any, userId: UserID) => {
    const games = await redis.lrangeAsync(`games-${userId}`, 0, MAX_GAMES);
    return games.map(valueToGameRow);
}

const findById = async (redis: any, id: GameID) => {
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

const create = async (redis: any, game: GameDetails, userId: UserID) => {
    const gameData = JSON.stringify(game, null, 0);
    const gameRowData = gameToValue(game, userId, new Date());
    try {
        await redis.lpushAsync(`games-${userId}`, gameRowData);
        await redis.ltrimAsync(`games-${userId}`, 0, MAX_GAMES - 1);
        await redis.setAsync(`game-${game.id}`, gameData);
        return game.id;
    } catch (err) {
        throw new Error('Unable to create game with id ' + game.id);
    }
}

const nextTurn = (game: GameDetails) => {

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

const save = async (redis: any, game: GameDetails) => {

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

            const games = await redis.lrangeAsync(userGamesKey, 0, MAX_GAMES);
            await redis.delAsync(userGamesKey);
            const list = games.map(valueToGameRow)
                .map((g: GameRow) => {
                    if (g.id === game.id) {
                        g.date = new Date();
                        g.kind = game.turn.kind;
                        g.owner = game.turn.owner;
                        g.number = game.turn.number;
                    }
                    return g;
                })
                .sort((a: GameRow, b: GameRow) => b.date.getTime() - a.date.getTime()) // newest first
                .map(gameRowToValue);

            let multi = redis.multi();
            list.forEach((value: string) => {
                multi.rpush(userGamesKey, value);
            });
            await multi.execAsync();
        });
    } catch (e) {
        throw new Error('Unable to update game lists');
    }
}

const valueToGameRow = (value: string) => {
    return JSON.parse(value) as GameRow;
};

const gameRowToValue = (gameRow: GameRow) => {
    return JSON.stringify(gameRow, null, 0);
};

const gameToValue = (game: GameDetails, userId: UserID, date: Date) => {
    const value: GameRow = {
        id: game.id,
        name: game.sides[userId].name,
        date: date,
        kind: game.turn.kind,
        owner: game.turn.owner,
        number: game.turn.number
    };
    return gameRowToValue(value);
};

export {
    findByIdAndUser,
    findAllByUser,
    findById,
    opposite
}

