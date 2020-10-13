import {Request, Response} from 'express';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';

/*
1. 이메일과 비번 일치하는 것 user 테이블에서 찾기 => 비번: 암호화한 것과 비교
2. 없으면 409, unauthorized
3. 있으면 세션에 담아주기
*/

export async function signin (req:Request, res:Response) {
  
  //소셜로그인이라면 req.body.socialLogin에 'kakao'나 'naver'기입
  const { email, password, name } = req.body;

  //기존 코드
  const session = req!.session!;
  const hash_password = await User.findOne({
    where: {
      email: email
    }
  })

  //소셜로그인의 경우
  if(email === 'kakao' || email === 'naver'){
    //패스워드는 자신 이메일 기반으로 만듦
    const encrypt_password_by_email = await bcrypt.hash(email, 10)
    .then(async () => {
      if(hash_password === null){
        async function createUser() {
          await User.create({
            name: name,
            email: email,
            password: encrypt_password_by_email
          })
          .then(newUser => {
            console.log("newUser:", newUser?.getDataValue('id'))
            console.log("session:", session)
            session.userid = newUser?.getDataValue('id');
            session.name = newUser?.getDataValue('name');
            session.email = newUser?.getDataValue('email');
            session.password_answer = newUser?.getDataValue('password_answer');
            session.save(function () {
              res.json({
                "id": newUser?.getDataValue('id'),
                "name": newUser?.getDataValue('name'),
                "email": newUser?.getDataValue('email')
              })
            })
          })
        }
        await createUser();
      }
    })
    .then(async () => {
      await bcrypt.compare(email, hash_password?.getDataValue('password'), (err, result) => {
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
    })
    //신규 사용자인 경우 회원가입을 먼저 시긴다.
    //로그인 실행
  }
  //일반로그인의 경우
  else{
    
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
}