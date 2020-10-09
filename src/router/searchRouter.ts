import express from "express";
import { search } from "../controller/search/search";
const searchRouter = express.Router();

searchRouter.post("/:id", search)

export = searchRouter;