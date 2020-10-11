import {Request, Response} from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

/*
1. 새로운 비밀번호와 유저id(user 테이블의 pk)를 받는다.
2. 받아온 유저id를 user table에서 찾는다.
3. 해당 row의 password에 변경된 비밀번호를 암호화해서 넣는다.
*/

export async function findpassword_resetpassword (req:Request, res:Response) {
  
  const { password, id } = req.body;
  const hash_password = await bcrypt.hash(password, 10);

  await User
  .update({
    password: hash_password
  }, {
    where: {
      id: id
    }
  })
  .then(result => {
    console.log(result)
    res.status(200).send("successfully changed")
  })
}