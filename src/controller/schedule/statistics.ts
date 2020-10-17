import { Request,Response } from 'express';
import { Op } from 'sequelize';
import { Schedule } from '../../models/schedule';
//1년 단위로 데이터 제공
//Ex, 현재 2020년이면 2020년의 지출, 들어온 돈 내역을 월 단위로 나누어서 제공해준다.
//schedule 탭 gitt 세분화 필요. 선물타입이 돈인지 무엇인지에 따라 기입하는 방법을 나누는 것이 필요할 것 같다.
//expectNextCost에서도 원활한 사용 위해

export async function statistics (req:Request, res:Response) {
    const date_now = new Date();
    const this_year_start = new Date(date_now.getFullYear(), 0 , 1);
    const this_year_end = new Date(date_now.getFullYear()+1, 0 , 1);

    //월 별로 데이터 제공
    /*

    {
        "9" : [],
        "10" : [],
        ...
    }

    */
    await Schedule.findAll({
        where : {
            UserId : req.params.id,
            date : {
                [Op.and] : {
                    [Op.gte] : this_year_start,
                    [Op.lt] : this_year_end
                }
            }
        },
        order : [
            ['date', 'ASC']
        ],
        attributes : ['date', 'event_target' , 'gift' ,'giveandtake' , 'type']
    })
    .then(data => {
        let result:any = {};
        data.forEach(element => {
            const month = element.getDataValue('date').getMonth()+1;
            if(result[month] === undefined){
                result[month] = {money : 0, gift : 0};
            }
            if(element.getDataValue('gift').split(':')[0] === "현금"){
                result[month].money += parseInt(element.getDataValue('gift').split(':')[1])
            }else{
                result[month].gift += 1;
            }
        })
        res.send(result);
    })
    .catch(err => console.error(err));

}