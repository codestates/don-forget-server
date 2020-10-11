import {Request, Response} from 'express';
import { IntegerDataType } from 'sequelize/types';
import { User } from '../../models/user';

/*
1. 로그인 된 유저의 id를 받아온다(params)
2. 변경될 name도 받아온다.
3. user 테이블에서 아이디에 해당하는 row를 찾아 name을 업데이트 해준다.
4. 업데이트 후, 다시 id와 변경된 name으로 유저를 찾아 정보를 보내준다.
*/

export async function changename (req:Request, res:Response) {
  
  const { name } = req.body;
  const userid = req.params.id;

  await User.update({
    name: name
  }, {
    where: {
      id: userid
    }
  })
  .then(result => {
    console.log("result:", result)
    async function findUser() {
      await User.findOne({
        where: {
          id: userid,
          name: name
        }
      })
      .then(data => {
        console.log("data:", data);
        res.status(200).send({"name": data?.getDataValue("name")});
      })
    }
    findUser();
  })
}