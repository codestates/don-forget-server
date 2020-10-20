import express, {Request, Response, NextFunction} from 'express';
import userRouter from "./router/userRouter";
import scheduleRouter from "./router/scheduleRouter";
import searchRouter from "./router/searchRouter";
import naverRouter from "./router/naverRouter";
import { Event } from './models/event-type';
import { Schedule } from './models/schedule';
import { User } from './models/user';
import { Password_Question } from './models/password-question';
const app = express();
const session = require('express-session');
const cors = require('cors')
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig = require('./controller/user/passport-naver');
passportConfig.naverLogin();
dotenv.config();

const mysqlStore = require('express-mysql-session')(session);
const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
const sessionStorage = new mysqlStore(options);
const acceptDomainLIst = [
  'https://www.don-forget.com',
  'http://localhost:3000'
];

// const corsOptions = {
//   origin: function (origin:string, callback:Function) {
//     if (acceptDomainLIst.indexOf(origin) !== -1) {      
//       callback(null, true)
//       cors
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(cookieparser());
app.use(bodyparser.json());
app.use(cors({
  origin : "https://www.don-forget.com",
  credentials: true
}));
app.use(
  session({
    secret: "donforget",
    resave: true,
    saveUninitialized: true,
    //testing --start
    store: sessionStorage,
    cookie: {
      domain : 'https://www.don-forget.com',
      // expires : new Date(Date.now() + (20000)),
      secure: false,
      // secure : true
    }
    // --end
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);
app.use("/search", searchRouter);
app.use("/oauth", naverRouter);

app.get('/', (request:Request, response:Response, next: NextFunction) => {
  response.send('hello');
});

// //passport 데이터 확인용
// app.get("/debug", (req:Request, res:Response) => {
//   res.json({
//     "req.session": req.session,
//     "req.user": req.user,

//     // passport 정보를 들여다 보자
//     "req._passport": req._passport,
//   })
// })

app.listen(5000,async ()=>{
  console.log('start');
  try {
    //모든 데이터를 찾는 과부하를 대체하기 위해 연결로 대체
    await Event.sync();
    await Schedule.sync();
    await User.sync();
    await Password_Question.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})
