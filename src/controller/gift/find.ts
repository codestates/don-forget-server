const client_id = '3pBnM6ZlaoVoOqR2DsOk';
const client_secret = '6mONWS48Se';
import Axios from 'axios';
import { Request, Response } from 'express';

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key:any, value:any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  

const find = (req:Request, res:Response) => {
    //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
    const query:any = req.query.text;
    console.log('query : ',query);
    const api_url = `https://openapi.naver.com/v1/search/shop.json?query=`+encodeURI(query)+'&display=100'; // json 결과
    console.log('api_url : ',api_url);
    const options = {
        headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
    };
    
    Axios.get(api_url, options)
        .then(result => JSON.stringify(result, getCircularReplacer()))
        .then(stringify => stringify.split('items')[1])
        .then(items => {
            let firstbaseIndex = 0;
            let firstBrocket = 0;
            let lastbaseIndex = 0;
            let lastBrocket = 0;
            let arr:any = [];
            while(items.indexOf('{',firstbaseIndex) !== -1 && items.indexOf('}',lastbaseIndex) !== -1){
                firstBrocket = items.indexOf('{',firstbaseIndex);
                lastBrocket = items.indexOf('}', lastbaseIndex)+1;
                firstbaseIndex = firstBrocket+1;
                lastbaseIndex = lastBrocket+1;
                arr.push(JSON.parse(items.slice(firstBrocket,lastBrocket)))
            }
            res.send(arr);
        })
        .catch(err => console.error(err));
        
}
export { find };
