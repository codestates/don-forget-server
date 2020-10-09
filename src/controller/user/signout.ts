import {Request, Response} from 'express';

export function signout (req:Request, res:Response) {
    res.send("signout");
}