import {Request, Response} from 'express';

export function signin (req:Request, res:Response) {
    res.send("signin");
}