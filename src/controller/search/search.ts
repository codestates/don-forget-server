import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Schedule } from '../../models/schedule';

/*
검색어: event_target(from schedule table) or type(from event_type)
1. 검색어가 사람 이름이라면, schedule table에서 (UserId = req.params.id && event_target = data)인 row 정보를 다 보내준다.
2. 검색어가 경조사 타입이라면, schedule table에서 (UserId = req.params.id && Event_id = 경조사 타입)인 row 정보를 다 보내준다.
*/

export async function search (req:Request, res:Response) {
  
  const { data } = req.body;
  const id = req.params.id;

  const find_type = await Schedule.findOne({
    where: {
      type: data
    }
  })
  
  if(find_type) {
    await Schedule.findAll({
      where: {
        UserId: id,
        type: find_type?.getDataValue('type')
      }
    })
    .then(data => {
      if (data.length !== 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send("no results");
      }
    })
  } else if(find_type === null) {
    await Schedule.findAll({
      where: {
        UserId: id,
        event_target: {[Op.like]: `%${data}%`}
      }
    })
    .then(data => {
      if(data.length !== 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send("no results");
      }
    })
  } else {
    res.status(404).send("no results");
  }
}