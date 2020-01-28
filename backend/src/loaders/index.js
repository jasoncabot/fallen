const expressLoader = require('./express');
const redisLoader = require('./redis');

module.exports = async (app) => {
    const redis = await redisLoader();
    console.log('Redis loaded');
    const express = await expressLoader(app);
    console.log('Express loaded');
    return { express, redis }
}