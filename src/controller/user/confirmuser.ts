import {Request, Response} from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

/*
로그인 후, 마이페이지에서 비밀번호 변경 전, "현재 비밀번호 확인하는 api"
1. 현재 로그인 된 유저의 id 가져오기(params)
2. 입력된 현재 비밀 받아오기
3. 입력된 현재 비밀번호가 DB의 user 테이블의 비밀번호와 일치하는지 확인하기
  - 암호화된 비번과 일치하는지 확인해야 함!!
*/

export async function confirmuser (req:Request, res:Response) {
  
  const { password } = req.body;
  const userid = req.params.id;
  console.log("userid:", userid)

  const hash_password = await User.findOne({
    where: {
      id: userid
    }
  })

  const check = await bcrypt.compare(password, hash_password?.getDataValue('password'));
  console.log("check:", check);
  if(check === true) {
    res.status(200).send("confirmed user");
  } else {
    res.status(401).send("wrong password");
  }
}