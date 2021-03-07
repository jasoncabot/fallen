const expressLoader = require('./express');
const redisLoader = require('./redis');
const socketioLoader = require('./socketio');

module.exports = async (app) => {
    const redis = await redisLoader();
    console.log('Redis loaded');
    const express = await expressLoader(app);
    console.log('Express loaded');
    const socketio = await socketioLoader();
    console.log('Socket.IO loaded');
    return { express, redis, socketio }
}