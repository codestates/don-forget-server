import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Password_Question } from './password-question';
import { Schedule } from './schedule';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password! : string;
  public password_question_id! : string;
  public password_answer! : string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        email: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          },
        password: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        // password_question_id: {
        //   type: new DataTypes.STRING(128),
        //   allowNull: false,
        // },
        password_answer: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
      },
      {
        tableName: "user",
        sequelize: database, // this bit is important
      }
)

User.belongsTo(Password_Question, { targetKey : "id"})
Password_Question.hasMany(User, { sourceKey : "id" })


User.sync({ force: false }).then(() => console.log("User table connected"));