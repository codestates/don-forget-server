import express from "express";
import { get, put, post, Delete } from "../controller/schedule/schedule";
import { statistics } from '../controller/schedule/statistics';
import { expectNextCost } from '../controller/schedule/expectNextCost';
const scheduleRouter = express.Router();

scheduleRouter.get("/:id", get);
scheduleRouter.post("/:id", post);
scheduleRouter.put("/:id", put);
scheduleRouter.delete("/:id", Delete);
scheduleRouter.get('/statistics/:id', statistics);
scheduleRouter.get('/expectNextCost/:id', expectNextCost);


export = scheduleRouter;