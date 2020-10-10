import {Request, Response} from 'express';

export async function signout (req:Request, res:Response) {
  await req!.session!.destroy(function() {
    req!.session!;
  });
  await res.clearCookie('connect.sid');
  await res.send('successfully signed out!');
}