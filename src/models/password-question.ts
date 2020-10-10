import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { User } from './user';

export class Password_Question extends Model {
  public id!: number;
  public type!: string;
}

Password_Question.init(
    {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        }
      },
      {
        tableName: "password_question",
        sequelize: database, // this bit is important
      }
)
//create table function
Password_Question.sync({ force: false }).then(() => console.log("Password_Question table connected"));