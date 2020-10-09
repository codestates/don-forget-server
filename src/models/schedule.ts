import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { User } from './user';
import { Event } from './event-type';

export class Schedule extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password! : string;
  public password_question_id! : string;
  public password_answer! : string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Schedule.init(
    {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        date: {
          type: new DataTypes.DATE,
          allowNull: false,
        },
        event_target: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        gift: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        // user_id: {
        //   type: new DataTypes.INTEGER,
        //   allowNull: false,
        // },
        // event_type_id: {
        //     type: new DataTypes.INTEGER,
        //     allowNull: false,
        // },
      },
      {
        tableName: "schedule",
        sequelize: database, // this bit is important
      }
)

Schedule.belongsTo(User, { targetKey : "id" })
User.hasMany(Schedule, { sourceKey : "id" })

Schedule.belongsTo(Event, { targetKey : "id" })
Event.hasMany(Schedule, { sourceKey : "id" })

Schedule.sync({ force: false }).then(() => console.log("Schedule table connected"));