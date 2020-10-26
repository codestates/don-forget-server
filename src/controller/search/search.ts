import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Schedule } from '../../models/schedule';

/*
검색어: event_target(from schedule table) or type(from event_type)
1. 검색어가 사람 이름이라면, schedule table에서 (UserId = req.params.id && event_target = data)인 row 정보를 다 보내준다.
2. 검색어가 경조사 타입이라면, schedule table에서 (UserId = req.params.id && Event_id = 경조사 타입)인 row 정보를 다 보내준다.
*/

interface Data{
  id : number,
  date : string,
  event_target : string,
  giveandtake : string,
  type : string,
  gift : object
}


export async function search (req:Request, res:Response) {
  
  const { data } = req.body;
  console.log("data:", data);
  if(data === "") {
    res.status(200).send([])
  }
  const id = req.params.id;

  const find_type = await Schedule.findOne({
    where: {
      type: data
    }
  })
  
  let schedule;
  if(find_type) {
    schedule = await Schedule.findAll({
      where: {
        UserId: id,
        type: find_type?.getDataValue('type')
      }
    })
    
  } 
  else{
    schedule = await Schedule.findAll({
      where: {
        UserId: id,
        event_target: {[Op.like]: `%${data}%`}
      }
    })
  }  
  let arr: Array<Data> = [];
  for (let i = 0; i < schedule.length; i++) {
    const element = schedule[i]
    const Day:Date = new Date(element.getDataValue('date'))
    const obj:Data = {
      id : element.getDataValue('id'),
      date : `${Day.getFullYear()}-${Day.getMonth()+1}-${Day.getDate()}`,
      event_target : element.getDataValue('event_target'),
      giveandtake : element.getDataValue('giveandtake'),
      type : element.getDataValue('type'),
      gift : [element.getDataValue('gift').split(':')[0], element.getDataValue('gift').split(':')[1]]
    };
    arr.push(obj);
  }
  res.status(200).send(arr);
}