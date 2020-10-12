import express from "express";
import { kakaoLogin } from "../controller/socialLogin/passport-kakao";
import { naverLogin } from "../controller/socialLogin/passport-naver";

const socialLoginRouter = express.Router();

socialLoginRouter.get('/naver', naverLogin);
socialLoginRouter.get('/kakaoLogin', kakaoLogin);

export = socialLoginRouter;