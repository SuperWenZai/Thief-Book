'use strict';
import axios from 'axios';
let iconv = require('iconv-lite');

const url = 'http://hq.sinajs.cn/list=';

export default {
  async getData(code, callback) {
    let results = await this.getsinajs(code);

    let arrStr = results.split('"')[1].split(',');
    let name = arrStr[0];
    let yesterday_price = parseFloat(arrStr[2]);
    let curr_price = parseFloat(arrStr[3]);
    let percentage = (curr_price - yesterday_price) / yesterday_price * 100

    let text = `${name}: ${curr_price.toFixed(3)} , ${percentage.toFixed(2)}%`;

    callback(text);
  },
  getsinajs(code) {
    return new Promise((resolve, reject) => {
      let headers = {
        url: url + code,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30秒超时
        responseType: "stream"
      };
      axios(headers)
        .then(res => {
          let chunks = [];
          
          res.data.on('data', chunk => {
            chunks.push(chunk);
          });

          res.data.on('end', () => {
            let buffer = Buffer.concat(chunks);
            //通过iconv来进行转化。
            let str = iconv.decode(buffer, 'gbk');
            resolve(str)
          })
        })
        .catch(error => {
          reject(error);
        })
    });
  }
}