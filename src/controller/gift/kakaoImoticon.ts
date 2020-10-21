import Axios from 'axios';
import { Request, Response } from 'express';
const axios = require('axios');
const cheerio = require("cheerio");
const request = require('request'); 
//request 모듈 사용 
const url = 'https://e.kakao.com/?referer=mac_more'; 

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


const getKakaoImoticon = (req:Request, res:Response) => {
    axios.get(url)
        .then((html_data:any) => {
            const $ = cheerio.load(html_data.data);
            const $bodyList = $("div.HotArea__RankProductList-sc-16dnrd5-0 eEoiFK")
            const stringify = JSON.stringify($bodyList, getCircularReplacer());
            res.send(JSON.parse(stringify)["_root"]["0"]["children"][0]["next"]["children"][0]["next"]["next"]["children"][0]["next"]["next"]["next"]["children"][0]["next"]["next"]["next"]["next"]["next"]["children"][0]["next"]["children"][0]["next"]["children"][0]["next"]["next"]["next"]["children"][0]["next"]["children"][0]["next"]["next"]["next"]["attribs"]["data-react-props"]);
        })
}



export { getKakaoImoticon }