import express from "express";
import { get, put, post, Delete} from "../controller/schedule/schedule";
const scheduleRouter = express.Router();

scheduleRouter.get("/:id", get);
scheduleRouter.post("/:id", post);
scheduleRouter.put("/:id?event_id", put);
scheduleRouter.delete("/:id?event_id", Delete);


export = scheduleRouter;