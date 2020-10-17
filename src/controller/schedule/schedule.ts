import {Request, Response} from 'express';
import { Schedule } from '../../models/schedule';

async function get (req:Request, res:Response) {

    const userid = req.params.id;
    //version1 : raw data 보내기, 없으면 빈배열을 보내기
    //해당 유저의 스케줄 모두 가져오기
    let schedule = await Schedule.findAll({
        where: {
            UserId : userid
        }
    })
    //해당 이벤트 아이디에 해당하는 이벤트 스트링 가져오기
    let list:any[] = [];
    schedule.map(element => {
        list.push({
            "id" : element.getDataValue('id'),
            "date" : element.getDataValue('date'),
            "type" : element.getDataValue('type'),
            "event_target" : element.getDataValue('event_target'),
            "gift" : element.getDataValue('gift'),
            "giveandtake" : element.getDataValue('giveandtake')
        })
    })
    res.status(200).send(list);
}

//version1 compelte
//나중에 params랑 session 비교하는 것도 넣자
async function post (req:Request, res:Response) {
    // const event = await Event.findOne({
    //     where : {
    //         type : req.body.event_type
    //     }
    // })
    const newSchedule = await Schedule.create({
        date : req.body.date,
        event_target : req.body.event_target,
        gift : `${req.body.gift[0]}:${req.body.gift[1]}`,
        UserId : req.params.id,
        type: req.body.type,
        giveandtake: req.body.giveandtake
    })
    console.log(newSchedule);
    await res.status(200).json({
        "message" : "succesfully added"
    })
}

async function put (req:Request, res:Response) {

    //해당 스케줄 찾기
    let schedule = await Schedule.findOne({
        where: {
            id : req.query.schedule_id,
            // EventId : req.query.event_id,
            UserId : req.params.id
        }
    })
    console.log('schedule : ',schedule);

    //스케줄 찾은 후 해당 스케줄의 event_type에 맞는 event table의 id값 가져오기
    // const event = await Event.findOne({
    //     where: {
    //         type : req.body.event_type
    //     }
    // })
    
    //date,event_target,gift, EventId
    await schedule?.update({
        date : req.body.date,
        event_target : req.body.event_target,
        gift : `${req.body.gift[0]}:${req.body.gift[1]}`,
        type : req.body.type,
        giveandtake : req.body.giveandtake
    })

    res.send(schedule);
    
}

async function Delete (req:Request, res:Response) {
    // const userid = req.params.id;
    // const eventid = req.query.event_id;
    // console.log('req.query : ', eventid);

    await Schedule.destroy({
        where : {
            UserId : req.params.id,
            id : req.query.schedule_id
        }
    })
    .then(result => res.send({ "message" : "successfully deleted" }))
    .catch(err => console.error(err));
}

export {get, post, put, Delete}
