import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Event extends Model {
  public id!: number;
  public type!: string;
}

Event.init(
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
        tableName: "event_type",
        sequelize: database, // this bit is important
      }
)


//create table
Event.sync({ force: false }).then(() => console.log("Event table connected"));