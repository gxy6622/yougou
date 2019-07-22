var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper');
var uploadPaths = require('../config').uploadPaths;
var file = require('../utils/file.js');
var path = require('path');
var upload = require('../utils/upload.js');

var router = express.Router();

//处理一级路由的请求
router.post('/list',function(req,res,next) {
// 	var cid = parseInt(req.body.cid);
// 	query('SELECT * FROM `dt_product` WHERE `cid` = ?;', [ cid ])
// 		.then(result => res.send(httpResult.success(result)))
// 		.catch(message => res.send(httpResult.error(null, message)));
	//项目四
	var cid = parseInt(req.body.cid);
	var begin = parseInt(req.body.begin);
	var count = parseInt(req.body.count);
	query('SELECT * FROM `dt_product` WHERE `cid` = ? LIMIT ?,?;', [ cid, begin, count ])
	    .then(results => res.send(httpResult.success(results)))
	    .catch(message => res.send(httpResult.error(null,message)));	
});


router.post('/list2', function(req, res, next) {
	var id = parseInt(req.body.id)
	query('SELECT * FROM `dt_product` WHERE `id` = ?;', [ id ])
	.then(result => res.send(httpResult.success(result)))
	.catch(message => res.send(httpResult.error(null,message)));
});

//后台商品信息管理
//query里面的【】顺序和存储过程的变量名顺序不能颠倒
router.post('/admin-list', function(req, res, next) {
	var { name, mId, sId, begin, pageSize } = req.body;
	query('CALL p_getProductByCondition(?,?,?,?,?);', [ name, mId, sId, begin, pageSize ])
		.then(results => {
			res.send(httpResult.success({ total: results[0][0].total, list: results[1] }))
		})
		.catch(message => res.send(httpResult.error(null,message)));
});

//banner批量上传更新
router.post('/banner/upload', upload.single('banner'), function(req, res, next) {
	var { id } = req.body;		//传要修改的id
	var { temp, root, detail } = uploadPaths;
	var fileName= req.file.filename;	//读出在temp中生成的图片的名字
	var filePath = detail + fileName;						//返还给客户端的路径
	var fromPath = path.join(temp, fileName);
	var toPath = path.join(root, detail, fileName);
	file.copy(fromPath, toPath)
		.then(() => file.unlink(fromPath))
		.then(() => query('CALL p_uploadProductBanner(?,?);', [ filePath, id ]))
		.then(data => res.send(httpResult.success(filePath)))
		.catch(message => res.send(httpResult.error(null, message)));
});

//banner图片删除
router.post('/banner/remove', function(req, res, next) {
	var { id, filePath, newBannerImgs } = req.body;
	query('UPDATE `dt_product` SET `bannerImgs` = ? WHERE `id` = ?;', [ newBannerImgs, id ])
		.then(() => file.unlink(path.join(uploadPaths.root, filePath)))
		.then(() => res.send(httpResult.success()))
		.catch(message => res.send(httpResult.error(null, message)));
});

//avatar上传
router.post('/uploadAvatar', upload.single('avatar'), function(req, res, next) {
	res.send(httpResult.success(req.file.filename));
});

//商品新增
router.post('/add', function(req, res, next) {
	console.log(req.body);
	var { avatar, name } = req.body;
	var cid = parseInt(req.body.cid);
	var price = parseInt(req.body.price);
	var oldPrice = parseInt(req.body.oldPrice);
	var markPrice = parseInt(req.body.markPrice);
	var { temp, root, product } = uploadPaths;
	var fromPath = path.join(temp, avatar);
	var toPath = path.join(root, product, avatar);
	file.copy(fromPath, toPath)
	.then(() => file.unlink(fromPath))
	.then(() => query('INSERT `dt_product`(cid, avatar, name, price, oldPrice, markPrice, bannerImgs) VALUES (?, ?, ?, ?, ?, ?, ?);', [ cid, product+avatar, name, price, oldPrice, markPrice, '' ]))
	.then(results => {
		console.log(222,results);
		if(results.affectedRows === 1) {
			res.send(httpResult.success(results.insertId, '新增成功'));
		} else {
			res.send(httpResult.failure(null, '新增失败'));
		}
	})
	.catch(message => res.send(httpResult.error(null, message)));
});

module.exports = router;