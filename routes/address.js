var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper');

var router = express.Router();
 
 //展示地址
 router.post('/list', function(req, res, next) {
	var name = req.session.name;
	 query('SELECT * FROM `dt_address` WHERE `name` = ?;', [ name ])
		.then(results => res.send(httpResult.success(results)))
		.catch(message => res.send(httpResult.error(null, message)));
 });
 //删除地址
 router.post('/remove', function(req, res, next) {
	 var id = JSON.parse(req.body.id);
	 query('DELETE FROM `dt_address` WHERE `id` = ?;', [ id ])
		.then(results => {
			if(results.affectedRows === 1) res.send(httpResult.success())
			else res.send(httpResult.failure(null, '删除失败..'))
		})
		.catch(message => res.send(httpResult.error(null, message)));
 })
 //新增地址
 router.post('/add', function(req, res, next) {
	 var receiveName = req.body.receiveName;
	 var receiveTel = req.body.receiveTel;
	 var receiveAddress = req.body.receiveAddress;
	 var name = req.session.name;
	 query('INSERT `dt_address`(`name`,`receiveName`,`receiveTel`,`receiveAddress`) VALUES (?,?,?,?);', [ name, receiveName, receiveTel, receiveAddress ])
		.then(results => {
			if(results.affectedRows === 1) res.send(httpResult.success(results.insertId, '地址添加成功..'));
			else res.send(httpResult.failure(null, '地址添加失败..'));
		})
		.catch(message => res.send(httpResult.error(null, message)));
 });
 
//编辑地址
 router.post('/edit', function(req, res, next) {
	var id = req.body.id;
	 query('SELECT * FROM `dt_address` WHERE `id` = ?;', [ id ])
		.then(results => res.send(httpResult.success(results)))
		.catch(message => res.send(httpResult.error(null, message)));
 });
 
//修改地址
 router.post('/update', function(req, res, next) {
 	 var receiveName = req.body.receiveName;
 	 var receiveTel = req.body.receiveTel;
 	 var receiveAddress = req.body.receiveAddress;
 	 var id = parseInt(req.body.id);
	 console.log(req.body.receiveName,req.body.receiveTel,req.body.receiveAddress,parseInt(req.body.id))
 	 query('UPDATE `dt_address` SET `receiveName` = ?,`receiveTel` = ?,`receiveAddress` = ? WHERE `id` = ?;', [ receiveName, receiveTel, receiveAddress, id ])
 		.then(results => {
 			if(results.affectedRows === 1) res.send(httpResult.success(null, '地址修改成功..'));
 			else res.send(httpResult.failure(null, '地址修改失败..'));
 		})
 		.catch(message => res.send(httpResult.error(null, message)));
 });
//  //设置为默认
//  router.post('/default', function(req, res, next) {
// 	var id = parseInt(req.body.id);
// 	var name = req.session.name;
// 	query('UPDATE `dt_address` SET `isDefault` = 0 WHERE `name` = ?;UPDATE `dt_address` SET `isDefault` = 1 WHERE `id` = ?;', [ name, id ]) 
// 		.then(results => res.send(httpResult.success(null, '默认地址设置成功..')))
// 		.catch(message => res.send(httpResult.error(null, message)));
//  });



module.exports = router;