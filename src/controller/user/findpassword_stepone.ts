import {Request, Response} from 'express';
import { User } from '../../models/user';
import { Password_Question } from '../../models/password-question'

/*
로그인 전, 비밀번호 찾기
1. user 테이블에서 이름, 이메일 일치하는 것 찾기
2. user 테이블의 해당하는 row에서 PasswordQuestionId 값 가져오기
3. password_question 테이블에서 일치하는 id의 type 가져오기
4. password_question의 type과, user의 password_answer 보내주기
*/

export async function findpassword_stepone (req:Request, res:Response) {
  
  const { email, name } = req.body;
  const get_password_question_id = await User.findOne({
    where: {
      email: email,
      name: name
    }
  });
  const password_answer = get_password_question_id?.getDataValue('password_answer');
  const userid = get_password_question_id?.getDataValue('id');

  const get_password_question_type = await Password_Question.findOne({
    where: {
      id: get_password_question_id?.getDataValue('PasswordQuestionId')
    }
  });
  const password_question = get_password_question_type?.getDataValue('type');

  const result:any = {};
  result["password_answer"] = password_answer;
  result["password_question"] = password_question;
  result["id"] = userid;

  if(password_answer && password_question) {
    res.status(200).send(result)
  } else {
    res.status(401).send("Invalid input")
  }
}