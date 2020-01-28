const gamesController = require('./games');

module.exports.inject = async (middleware) => {
    gamesController.register(middleware.express, middleware.redis);
}