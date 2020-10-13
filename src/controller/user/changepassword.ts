import {Request, Response} from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

/*
로그인 후, 마이페이지에서 비밀번호 재설정하는 api
1. 현재 로그인 된 유저의 id 가져오기(params)
2. 변경될 비밀번호를 가져온다.
3. 유저의 id로 user 테이블에서 해당 row 찾는다.
4. 해당 row에 변경될 비밀번호를 암호화 해서 넣는다.
*/

export async function changepassword (req:Request, res:Response) {

  const { password } = req.body;
  const userid = req.params.id;
  const hash_password = await bcrypt.hash(password, 10);

  await User.update({
    password: hash_password
  }, {
    where: {
      id: userid
    }
  })
  .then(result => {
    console.log(result)
    res.status(200).send("successfully changed")
  })
}