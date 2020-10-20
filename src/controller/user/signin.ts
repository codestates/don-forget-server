import {Request, Response} from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

/*
1. 이메일과 비번 일치하는 것 user 테이블에서 찾기 => 비번: 암호화한 것과 비교
2. 없으면 409, unauthorized
3. 있으면 세션에 담아주기
*/

export async function signin (req:Request, res:Response) {
  
  const { email, password, name } = req.body;
  const session = req!.session!;
  
  //소셜로그인의 경우
  //소셜로그인이라면 req.body.socialLogin에 'kakao'나 'naver'기입
  if(email[0] === 'kakao' || email[0] === 'naver'){
    const socialUser = await User.findOne({
      where: {
        email: `${email[0]}-${email[1]}`
      }
    })
    //패스워드는 자신 이메일 기반으로 만듦
    await bcrypt.hash(email[0], 10)
    .then(async (result) => {
      if(socialUser === null){
        async function createUser() {
          await User.create({
            name: name,
            email: `${email[0]}-${email[1]}`,
            password: result
          })
        }
        await createUser();
      }
    })
    .then(async () => {
      await bcrypt.compare(email[0], socialUser?.getDataValue('password'), (err, result) => {
        if(err) {
          console.log(err);
          res.status(401).send("Unauthorized")
        } else {
          // result = true;
          (async function findUser() {
            const user = await User.findOne({
              where: {
                email: `${email[0]}-${email[1]}`
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
                res.setHeader('content-type', 'application/json');
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
    })
  }
  //일반로그인의 경우
  else{
    //입력한 비밀번호의 암호화를 씌우고, 이메일을 받아 기존 유저 있는지 확인한다.
    //있으면 아이디 정보를 할당하고, 없으면 401을 보낸다.
    const websiteUser = await User.findOne({
      where : {
        email : email
      }
    }).then(result => {
      if(result === null){
        res.status(401).send("Unauthorized-not-exist-user")
      }else{
        return result;
      }
    })
    //암호화 된 비밀번호와 db의 암호를 비교해서 틀리면 401을 보내고
    //맞으면 필요한 정보를 보낸다.
    await bcrypt.compare(password, websiteUser?.getDataValue('password'), (err, result) => {
      if(err || !result) {
        console.log(err);
        res.status(401).send("Unauthorized-not-correct-password")
      } 
      else {
        // result = true;
        async function findUser() {
          console.log("user:", websiteUser?.getDataValue('id'))
          console.log("session:", session)
          session.userid = websiteUser?.getDataValue('id');
          session.name = websiteUser?.getDataValue('name');
          session.email = websiteUser?.getDataValue('email');
          session.password_answer = websiteUser?.getDataValue('password_answer');
          session.save(function () {
            res.setHeader('content-type', 'application/json');
            res.status(200).json({
              "id": websiteUser?.getDataValue('id'),
              "name": websiteUser?.getDataValue('name'),
              "email": websiteUser?.getDataValue('email')
            })
          })
        };
        findUser()
      }
    })
  }
}