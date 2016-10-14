
const util = require('util')
const msg = require('./msg.js');
const ejs = require('ejs');
const path = require('path')
const Promise = require('promise')
const fs = require('fs')
const tpl = path.resolve(__dirname, 'tpl/index.ejs');


module.exports.mail = (json) => {

  const d = new Date();
  const from = 'g_DBASIC_APP_PRD_Int_vid';
  const title = `【互动视频知识weekly】- ${util.format('%s-%s-%s', d.getFullYear(), d.getMonth()+1, d.getDate())}`;
  const to = 'sampsonwang;';
  const html;

  const _data = {
    data: json
  }
  return new Promise((resolve, reject) => {

    ejs.renderFile(tpl, _data, {}, (err, str) => {
      if (err) {
        console.log(err)
        reject(err)
      }

      msg.mail(from, title, str, to);
      resolve(str)
    })
  })

  

}
