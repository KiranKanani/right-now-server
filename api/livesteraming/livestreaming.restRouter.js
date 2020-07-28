import express from "express";
import {
    createLiveStream,
    deleteLiveStream,
    fetchLiveSteam,
    startLiveSteam,
    stopLiveStream
} from './livestreaming.controller'
export const liveRouter = express.Router();
liveRouter.post('/createstream',createLiveStream)
liveRouter.post('/deletelivesteam',deleteLiveStream)
liveRouter.post('/fetchlivesteam',fetchLiveSteam)
liveRouter.post('/startlivesteam',startLiveSteam)
liveRouter.post('/stoplivesteam',stopLiveStream)