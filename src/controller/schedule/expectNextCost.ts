import { Request,Response } from 'express';
import { Op } from 'sequelize';
import { Schedule } from '../../models/schedule';
//1년 단위로 데이터 제공
//Ex, 현재 2020년이면 2020년의 지출, 들어온 돈 내역을 월 단위로 나누어서 제공해준다.
//schedule 탭 gitt 세분화 필요. 선물타입이 돈인지 무엇인지에 따라 기입하는 방법을 나누는 것이 필요할 것 같다.
//expectNextCost에서도 원활한 사용 위해
type find_rows_and_count = void | { rows : Schedule[] } | { count: number; };
export async function expectNextCost (req:Request, res:Response) {
    //현시점의 다음달 '월'을 파악한다.
    //ex) 2020-10-02 ---> 11월 데이터 제공
    //앞에 날짜부터 제공

    //1. 다음달 기간을 설정한다.
    const date_now = new Date();
    const next_month_start = new Date(date_now.getFullYear(), date_now.getMonth()+1 , 1);
    const next_month_end = new Date(date_now.getFullYear(), date_now.getMonth()+2 , 1);

    //2. 다음달 기간과 user_id에 매칭되는 스케줄들을 배열로 가져와 보내준다.
    const result:find_rows_and_count = await Schedule.findAndCountAll({
        where : {
            UserId : req.params.id,
            date : {
                [Op.and] : {
                    [Op.gte] : next_month_start,
                    [Op.lt] : next_month_end
                }
            }
        },
        order : [
            ['date', 'ASC']
        ],
        attributes : ['date', 'event_target' , 'gift' ,'giveandtake' , 'type']
    })
    .catch(err => console.error(err));
    
    //3. 필요한 컬럼들을 뽑아오기
    res.send(result);
}
