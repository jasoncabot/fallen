import { load as redisLoader } from './redis';
import { load as socketioLoader } from './socketio';
import { load as expressLoader } from './express';
import { Middleware } from '../index.interface';

const initialiseMiddleware: () => Promise<Middleware> = async () => {
    const redis = await redisLoader();
    console.log('Redis loaded');
    const express = await expressLoader();
    console.log('Express loaded');
    const socketio = await socketioLoader();
    console.log('Socket.IO loaded');
    return { express, redis, socketio }
}

export { initialiseMiddleware };
