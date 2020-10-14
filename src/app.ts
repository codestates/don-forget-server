import express, {Request, Response, NextFunction} from 'express';
import userRouter from "./router/userRouter";
import scheduleRouter from "./router/scheduleRouter";
import searchRouter from "./router/searchRouter";
import naverRouter from "./router/naverRouter";
import { database } from './config/database';
import { User } from './models/user';
import { Event } from './models/event-type';
import { Password_Question } from './models/password-question';
import { Schedule } from './models/schedule';
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

app.use(cookieparser());
app.use(bodyparser.json());
app.use(cors({
  origin : "*",
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
      expires : new Date(Date.now() + (20000)),
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

app.listen(5000,async ()=>{
  console.log('start');
  try {
    await database.authenticate();
    console.log('Connection has been established successfully.');
    await User.findAll()
          .then(result => console.log('User connected'))
          .catch(err => console.error(err));

    await Event.findAll()
    .then(result => console.log('Event connected'))
    .catch(err => console.error(err));

    await Password_Question.findAll()
    .then(result => console.log('Password_Question connected'))
    .catch(err => console.error(err));

    await Schedule.findAll()
    .then(result => console.log('Schedule connected'))
    .catch(err => console.error(err));

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})
