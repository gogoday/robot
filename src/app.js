

const path = require('path')
const local = require('./lib/robot-local')
const parse = require('./lib/robot-parse-rss')
const mail = require('./lib/robot-mail')

const tmp_db_path = path.resolve(__dirname, '../db/rss');
const origin_file = path.resolve(__dirname, '../db/rss/origin');

var done_cont = 0;

// 要抓取那些网站
const targetSites = [
  'http://www.ruanyifeng.com/blog/atom.xml',
  'http://javascriptweekly.com/rss/1gh8b434',
  'http://feeds.gracecode.com/gracecode/',
  'https://hacks.mozilla.org/feed/',
  'http://www.infoq.com/cn/feed',
  'https://cnodejs.org/rss',
  'http://fex.baidu.com/feed.xml',
  'https://www.smashingmagazine.com/feed/',
  'http://feed.cnblogs.com/blog/u/90635/rss',
  'http://gold.xitu.io/rss'
]


function start () {
  console.log('robot starting...');

  targetSites.forEach((item, index) => {

    const mpath = path.resolve(tmp_db_path, String(index));
    parse(item, index).then(out => {
      local.save(mpath, out);
      done_cont++;
    }).catch(err => {
      console.log(err)
    })


  }) 

  const done = new Promise((resolve, reject) => {
    var timeout = setTimeout(() => {
      clearTimeout(intervalue)
      resolve(true)
    }, 60e3)
    var intervalue = setInterval(() => {
      if (done_cont == targetSites.length) {
        resolve(true);
        _end();
      }
    }, 1e3)
    function _end() {
      clearTimeout(timeout)
      clearInterval(intervalue);
    }
  })
  
  done.then(() => {
    console.log('all file load success. ')
    merger()
    send_mail();
    
  })
  
  function merger() {
    for (var i = 0; i < done_cont; i++) {
      local.diff(origin_file, path.resolve(tmp_db_path, String(i)));
    }

    console.log('all file merger succcess.')
  }

  function send_mail() {
    var str = local.read(origin_file);
    var json = JSON.parse(str)
    console.log(`start send mail, json.length: ${json.length}`)
    mail(json).then(str => {

      console.log('send mail success .....')
    }).catch(err => {

      console.log(err)
    });
  }

}
start();

