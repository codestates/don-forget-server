import { User } from '../../models/user';
import {Request, Response} from 'express';
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const config = require('../../../config.json');
// const { request } = require('../..');
// const session = require('express-session');

export async function naverLogin(req:Request, res:Response){
  // const session = req!.session!
  passport.serializeUser(function(user:any, done:any) {
    console.log("세션에 기록하기")
    done(null, {
       id: user["id"],
       email: user["email"]
    });
 });

  passport.deserializeUser((user:any, done:any) => {
    console.log("세션에서 사용자 정보 읽기")
    done(null, user);
  });

  passport.use(new NaverStrategy({
    clientID: config.naver.client_id,
    clientSecret: config.naver.client_secret,
    callbackURL: config.naver.redirectURI
  },
    async function(accessToken:any, refreshToken:any, profile:any, cb:any) {
      console.log(accessToken, refreshToken)
      console.log("profile:", profile)
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const user = await User.findOne({ where: { email: email }})
      if(user) {
        // session.id = user?.getDataValue('id');
        // session.userid = User.dataValues.id;
        return cb(null, user)
      } else {
        const newUser = await User.create({
          name: name,
          email: email,
          provider: 'naver'
        })
        return cb(null, newUser)
      }
    }
  ));
}
