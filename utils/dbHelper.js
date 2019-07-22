//连接数据库
var mysql = require('mysql');

function query(sql, params = []) {
        var connect = mysql.createConnection({
           host: 'localhost',
           user: 'root',
           password: '123',
           database: 'ugou'
        });
        return new Promise(function(resolve, reject) {
           connect.query(sql, params, function(err, results, fields) {
              connect.end();
              if(err) reject(err.message);
              else resolve(results);
           });
        });
}
//导出query方法
module.exports = query;