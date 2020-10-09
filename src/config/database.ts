import { Sequelize } from "sequelize";
require('dotenv').config();

const config:any = {
  database : process.env.DB_NAME,
  username : process.env.DB_USER,
  password : process.env.DB_PASSWORD
}

const option:any = {
  port : process.env.DB_PORT,
  dialect : process.env.DB_DIALECT,
  host : process.env.DB_HOST
}

export const database:any = new Sequelize(
  config.database,
  config.username,
  config.password,
  option
);