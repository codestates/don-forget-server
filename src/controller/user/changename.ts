import {Request, Response} from 'express';

export function changename (req:Request, res:Response) {
    res.send("changename");
}