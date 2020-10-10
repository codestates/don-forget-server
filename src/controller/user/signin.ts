import {Request, Response} from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

/*
1. 이메일과 비번 일치하는 것 user 테이블에서 찾기 => 비번: 암호화한 것과 비교
2. 없으면 409, unauthorized
3. 있으면 세션에 담아주기
*/

export async function signin (req:Request, res:Response) {

  const { email, password } = req.body;
  const session = req!.session!;
  const hash_password = await User.findOne({
    where: {
      email: email
    }
  })
  
  await bcrypt.compare(password, hash_password?.getDataValue('password'), (err, result) => {
    if(err) {
      console.log(err);
      res.status(401).send("Unauthorized")
    } else {
      // result = true;
      (async function findUser() {
        const user = await User.findOne({
          where: {
            email: email
          }
        })
        if(user === null) {
          res.status(401).send("Unauthorized")
        } else {
          console.log("user:", user?.getDataValue('id'))
          console.log("session:", session)
          session.userid = user?.getDataValue('id');
          session.name = user?.getDataValue('name');
          session.email = user?.getDataValue('email');
          session.password_answer = user?.getDataValue('password_answer');
          session.save(function () {
            res.status(200).json({
              "id": user?.getDataValue('id'),
              "name": user?.getDataValue('name'),
              "email": user?.getDataValue('email')
            })
          })
        }
      })();
    }
  })
}