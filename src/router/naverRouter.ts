import express from "express";
import {Request, Response} from 'express';
// import { naverLogin } from '../controller/user/passport-naver';

const naverRouter = express.Router();
const passport = require('passport');

naverRouter.get('/naver', passport.authenticate('naver'), 
  (req:Request, res:Response) => {
    res.cookie('session_id', "id")
    res.send();
  },
);

naverRouter.get('/naver/callback', passport.authenticate('naver', { failureRedirect: '/naver'}),
  (req:Request, res:Response) => {
    console.log('-----------req:', req.cookies)
    res.cookie('session_id', "id", { sameSite: 'none', secure: true, httpOnly: false})
    res.redirect('http://localhost:3000/mypage')
  }
);

export = naverRouter;