import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { User } from './user';

export class Schedule extends Model {
  public id!: number;
  public date!: Date;
  public event_target!: string;
  public password! : string;
  public gift! : string;
  public type! : string;
  public giveandtake! : string;
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
        type: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        giveandtake: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        }
      },
      {
        tableName: "schedule",
        sequelize: database, // this bit is important
      }
)

Schedule.belongsTo(User, { targetKey : "id" })
User.hasMany(Schedule, { sourceKey : "id" })

Schedule.sync({ force: false }).then(() => console.log("Schedule table connected"));