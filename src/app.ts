import express, {Request, Response, NextFunction} from 'express';
import userRouter from "./router/userRouter";
import scheduleRouter from "./router/scheduleRouter";
import searchRouter from "./router/searchRouter";
import { database } from './config/database';
import { User } from './models/user';
import { Event } from './models/event-type';
import { Password_Question } from './models/password-question';
import { Schedule } from './models/schedule';
const cors = require('cors')
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cookieparser());
app.use(bodyparser.json());
app.use(cors());

app.get('/', (request:Request, response:Response, next: NextFunction) => {
  response.send('hello');
});

app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);
app.use("/search", searchRouter);


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