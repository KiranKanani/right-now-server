import express from 'express';
import {
    liveRouter
} from './livesteraming'
export const restRouter = express.Router();
restRouter.use('/live',liveRouter)