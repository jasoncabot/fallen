const expressLoader = require('./express');
const redisLoader = require('./redis');
const socketioLoader = require('./socketio');

module.exports = async () => {
    const redis = await redisLoader();
    console.log('Redis loaded');
    const express = await expressLoader();
    console.log('Express loaded');
    const socketio = await socketioLoader();
    console.log('Socket.IO loaded');
    return { express, redis, socketio }
}