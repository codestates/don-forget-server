import express from "express";
import { find } from "../controller/gift/find";
import { getKakaoImoticon } from "../controller/gift/kakaoImoticon";
const giftRouter = express.Router();
giftRouter.get("/find", find)
giftRouter.get("/imoticonList", getKakaoImoticon);

export = giftRouter;