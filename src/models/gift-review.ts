import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Gift extends Model {
    public id! : number;
    public title! : string;
    public image! : string;
    public lprice! : string;
    public hprice! : string;
    public mallName : string | undefined;
    public productId! : string;
    public productType! : string;
    public brand : string | undefined;;
    public maker : string | undefined;;
    public category1 : string | undefined;;
    public category2 : string | undefined;;
    public category3 : string | undefined;;
    public category4 : string | undefined;;
    public clickCount : number | undefined;
    public link : string | undefined;
}

Gift.init(
    {
        id : {
            type : DataTypes.INTEGER.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        link : {
            type : DataTypes.STRING,
            allowNull : false
        },
        image : {
            type : DataTypes.STRING,
            allowNull :false
        },
        lprice : {
            type : DataTypes.STRING,
            allowNull : false
        },
        hprice : {
            type : DataTypes.STRING,
            allowNull : false
        },
        mallName : {
            type : DataTypes.STRING,
            allowNull : true
        },
        productId : {
            type : DataTypes.STRING,
            allowNull : false
        },
        productType : {
            type : DataTypes.STRING,
            allowNull : false
        },
        brand : {
            type : DataTypes.STRING,
            allowNull : true
        },
        maker : {
            type : DataTypes.STRING,
            allowNull : true
        },
        category1 : {
            type : DataTypes.STRING,
            allowNull : true
        },
        category2 : {
            type : DataTypes.STRING,
            allowNull : true
        },
        category3 : {
            type : DataTypes.STRING,
            allowNull : true
        },
        category4 : {
            type : DataTypes.STRING,
            allowNull : true
        },
        clickCount : {
            type : DataTypes.INTEGER,
            allowNull : false,
            defaultValue : 1
        }

    },{
        tableName: "gift_review",
        sequelize:database
    }
)

Gift.sync({force:false}).then(() => console.log("Gift table connected"))