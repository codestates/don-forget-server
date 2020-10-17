import {Request, Response} from 'express';
import { User } from '../../models/user';
import { Password_Question } from '../../models/password-question'
import bcrypt from 'bcrypt';

/*
1. 이메일이 이미 존재하면 에러
2. 없으면 DB에 넣기
  - 이름/이메일/비번/비번답은 그대로 유저 테이블에 넣기
  - 비밀번호질문은 비밀번호질문 테이블에서 해당하는 id 찾아서 넣기
3. 비밀번호 암호화
*/

export async function signup (req:Request, res:Response) {

  const { type, name, email, password, password_answer } = req.body;
  const hash_password = await bcrypt.hash(password, 10);
  const password_question_id = await Password_Question.findOne({
    where: {
      type: type
    }
  });

  await User
    .findOne({
      where: {
        email: email
      }
    })
    .then(result => {
      if(result !== null) {
        res.status(409);
        res.send("already exist.")
      } else {
        async function createUser() {
          await User.create({
            name: name,
            email: email,
            password: hash_password,
            password_answer: password_answer,
            PasswordQuestionId: password_question_id?.getDataValue('id')
          })
          .then(result => res.status(201).send({ "message" : "completely signed up" }))
        }
        createUser();
      }
    })
    .catch(err => res.status(409).send(err));
}