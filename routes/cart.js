var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper');

var router = express.Router();
 
//数据展示
router.post('/list', function(req,res,next) {
	query('CALL p_getCartInfo(?)',[ req.session.name ])
		.then(results => res.send(httpResult.success(results[0])))
		.catch(message => res.send(httpResult.error(null,message)));
 });
//增加数量
router.post('/increase',function(req,res,next) {
	query('UPDATE `dt_cart` SET `count` = `count` + 1,`shoppingTime` = ? WHERE `id` = ?;',[ new Date(), parseInt(req.body.id) ])
		.then(results => {
			if(results.affectedRows === 1) res.send(httpResult.success());
			res.send(httpResult.failure(null,'新增数量失败'));
		})
		.catch(message => res.send(httpResult.error(null,message)));
 });
//减少数量
router.post('/decrease',function(req,res,next) {
 	query('UPDATE `dt_cart` SET `count` = `count` - 1,`shoppingTime` = ? WHERE `id` = ?;',[ new Date(), parseInt(req.body.id) ])
 		.then(results => res.send(httpResult.success()))
 		.catch(message => res.send(httpResult.error(null,message)));
 });
//删除商品
router.post('/remove',function(req,res,next) {
	var ids = JSON.parse(req.body.ids);
	query('DELETE FROM `dt_cart` WHERE `id` IN (?);', [ ids ])
		.then(results => {
			if(results.affectedRows === ids.length) res.send(httpResult.success());
			else res.send(httpResult.failure(null, '删除商品失败'));
		})
		.catch(message => res.send(httpResult.error(null,message)));
});
//订单生成
router.post('/settlement', function(req,res,next) {
	var account = parseInt(req.body.account);
	var ids = JSON.parse(req.body.ids).join(',');
	var name = req.session.name;
	query('CALL `p_settlement`(?,?,?,?);', [ ids, account,new Date(), name ])
		.then(results => {
			// console.log(results[0][0].orderId);
			res.send(httpResult.success(results[0][0].orderId));
		})
		.catch(message => res.send(httpResult.error(null,message)));
});
module.exports = router;