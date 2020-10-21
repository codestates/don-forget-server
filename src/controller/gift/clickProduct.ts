import { Request, Response } from 'express';
import { Gift } from '../../models/gift-review';

const clickProduct = async (req:Request, res:Response) => {
    const productId = req.body.productId;
    let product = await Gift.findOne({
        where : {
            productId : productId
        }
    })
    if(product === null){
        await Gift.create({
            title: req.body.title,
            link: req.body.link,
            image: req.body.image,
            lprice: req.body.lprice,
            hprice: req.body.hprice,
            mallName: req.body.mallName ,
            productId: req.body.productId ,
            productType: req.body.productType ,
            brand: req.body.brand ,
            maker: req.body.maker, 
            category1: req.body.category1 ,
            category2: req.body.category2 ,
            category3: req.body.category3 ,
            category4: req.body.category4 
        })
        res.send({"message" : `make new product, productId : ${productId}`})
    }else{
        const clickCount = product.getDataValue('clickCount');
        await Gift.update({clickCount : clickCount + 1},{
            where : {
                productId : productId
            }
        });
        res.send({"message" : `increase click count productId : ${productId}`})
    }
        
}
export { clickProduct };