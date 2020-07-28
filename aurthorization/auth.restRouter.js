import express from "express";
import {
    signup,
    signin,
    forgotPassword,
    resetpassword
} from './auth.controller'
import {requireSignIn} from './auth.middleware'
export const authRouter = express.Router();
authRouter.post('/forgetpassword', forgotPassword)
authRouter.post("/signup", signup);
authRouter.post('/signin',signin)
authRouter.post('/resetpassword',resetpassword)