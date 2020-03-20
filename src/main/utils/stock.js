'use strict';
import axios from 'axios';
let iconv = require('iconv-lite');

const url = 'http://hq.sinajs.cn/list=';

export default {
  getData(code, callback) {
    let textAll = "";
    this.promiseAxios(code).then(results => {
      let arr = results.toString().split(",")
      let name = String(arr[0].split('"')[1]);
      let yesterday_price = parseFloat(arr[2]);
      let curr_price = parseFloat(arr[3]);
      let percentage = (curr_price - yesterday_price) / yesterday_price * 100
      let text = `${name}: ${curr_price.toFixed(3)} , ${percentage.toFixed(2)}%`;
      textAll = textAll + text + "||";
      textAll = textAll.substring(0, textAll.length - 2)
      callback(textAll);
    })
  },
  promiseAxios(code) {
    return new Promise(function (resolve, reject) {
      axios({
          url: url + code,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000, // 30秒超时
          responseType: "stream"
        })
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
    });
  }
}