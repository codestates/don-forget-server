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
  if(email[0] === 'google'){
    const socialUser = await User.findOne({
      where: {
        email: `${email[0]}-${email[1]}`
      }
    })
    
    if(socialUser === null) {
      const newUser = await User.create({
        email: `${email[0]}-${email[1]}`,
        name: name
      })
      session.userid = newUser?.getDataValue('id');
      session.name = newUser?.getDataValue('name');
      session.email = newUser?.getDataValue('email');
      session.save(function() {
        res.status(200).json({
          "id": newUser?.getDataValue('id'),
          "name": newUser?.getDataValue('name'),
          "email": newUser?.getDataValue('email'),
        });
      })
    }
    else {
      session.userid = socialUser?.getDataValue('id');
      session.name = socialUser?.getDataValue('name');
      session.email = socialUser?.getDataValue('email');
      session.save(function() {
        res.status(200).json({
          "id": socialUser?.getDataValue('id'),
          "name": socialUser?.getDataValue('name'),
          "email": socialUser?.getDataValue('email'),
        });
      })
    }
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