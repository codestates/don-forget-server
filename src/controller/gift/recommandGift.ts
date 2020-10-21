import { Request, Response } from 'express';
import { Gift } from '../../models/gift-review';

const recommandGift = async (req:Request, res:Response) => {
    const recommand_list = await Gift.findAll({
        order : [['clickCount','DESC']],
        limit : 8
    })
    res.send(recommand_list);
        
}
export { recommandGift };