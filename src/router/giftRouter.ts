import express from "express";
import { clickProduct } from "../controller/gift/clickProduct";
import { find } from "../controller/gift/find";
import { getKakaoImoticon } from "../controller/gift/kakaoImoticon";
import { recommandGift } from "../controller/gift/recommandGift";
const giftRouter = express.Router();

giftRouter.post("/find", find)
giftRouter.get("/imoticonList", getKakaoImoticon);
giftRouter.get("/recommandGift", recommandGift);
giftRouter.post("/clickProduct", clickProduct)


export = giftRouter;