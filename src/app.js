

const path = require('path')
const local = require('./lib/robot-local')
const parse = require('./lib/robot-parse-rss')

const tmp_db_path = path.resolve(__dirname, '../db/rss');
const origin_file = path.resolve(__dirname, '../db/rss/origin');

var done_cont = 0;

// 要抓取那些网站
const targetSites = [
  'http://www.ruanyifeng.com/blog/atom.xml',
  'http://javascriptweekly.com/rss/1gh8b434'
]


function start () {
  console.log('robot starting...');

  targetSites.forEach((item, index) => {

    const mpath = path.resolve(tmp_db_path, String(index));
    console.log(mpath)
    parse(item).then(out => {
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
    console.log('done....')
    merger()
  })
  
  function merger() {
    for (var i = 0; i < done_cont; i++) {
      console.log(`tmp_db_path: ${path.resolve(tmp_db_path, String(i))}`);
      console.log(`origin_file: ${origin_file}`);
      local.diff(origin_file, path.resolve(tmp_db_path, String(i)));
    }
  }

}
start();

