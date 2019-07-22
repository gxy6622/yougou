var express = require('express');
var httpResult = require('../config').httpResult;
var uploadPaths = require('../config').uploadPaths;
var mysql = require('mysql');
var query = require('../utils/dbHelper');
var file = require('../utils/file.js');
var path = require('path');
var upload = require('../utils/upload.js');

var router = express.Router();

// 图片上传
router.post('/upload', upload.single('avatar'), function(req, res, next) {
	res.send(httpResult.success(req.file.filename));
});


//缓存所有分类数据（所有用户都会看的数据且是一样的数据）
//var category = null;
//创建连接对象connect,通过connect连接对象调用query方法自动连接数据库，执行指定的sql语句
//query('SELECT * FROM `dt_category`;')
	//.then(results => category = results)
	//.catch(message => console.log(message));
//处理获取一级分类的请求
router.get('/main', function(req, res, next) {
	query('SELECT * FROM `dt_category` WHERE `fid` = 0;')
		.then(data => res.send(httpResult.success(data)))
		.catch(message => res.send(httpResult.error(null, message)));
	//var data = category.filter(item => item.fid === 0);
	//res.send(httpResult.success(data));
});
//处理获取指定一级分类的二级分类信息的请求
router.get('/sub', function(req, res, next) {
	var id = parseInt(req.query.id);
	query('SELECT * FROM `dt_category` WHERE `fid` = ?;', [ id ])
		.then(data => res.send(httpResult.success(data)))
		.catch(message => res.send(httpResult.error(null, message)));
	//var data = category.filter(item => item.fid === id);
	//res.send(httpResult.success(data));
});
// 删除分类
router.post('/remove', function(req, res, next) {
	var id = parseInt(req.body.id);
	var avatar = req.body.avatar;
	query('CALL p_removeCategory(?);', [ id ])
		.then(results => results[0][0].result)
		.then(results => {
			if(results === '') {
				if(avatar === '') {
					res.send(httpResult.success(null, '删除成功'));
				} else {
					console.log(path.join(__dirname, '../public', avatar));
				//var avatarPath = path.join(__dirname, '../public', avatar);
				//删除分类对应图片
				file.unlink(path.join(uploadPaths.root, avatar))
					.then(() => res.send(httpResult.success(null, '删除成功')))
					.catch((err) => res.send(httpResult.failure(null, err.message)));
				}
			}
			else res.send(httpResult.failure(null, results));
		})
		.catch(message => res.send(httpResult.error(null, message)));
});

// 新增分类
router.post('/add', function(req, res, next) {
	var { fid, name, avatar } = req.body;
	var { temp, root, category } = uploadPaths;
	var fromPath = path.join(temp, avatar);
	var toPath = path.join(root, category, avatar);
	if(avatar === '') {
		query('CALL p_addCategory(?,?,?);', [ fid, name, avatar ])
			.then(results => results[0][0].result)
			.then(data => res.send(httpResult.success(data, '新增成功')))
			.catch(message => res.send(httpResult.error(null, message)));
	} else {
		file.copy(fromPath, toPath)
		.then(() => file.unlink(fromPath))
		.then(() => query('Call p_addCategory(?,?,?);', [ fid, name, category + avatar ]))
		.then(results => results[0][0].result)
		.then(data => res.send(httpResult.success(data, '新增成功')))
		.catch(message => res.send(httpResult.error(null, message)));
	}
	
});

// 修改分类
router.post('/update', function(req, res, next) {
	var { id, fid, name, avatar, oldAvatar } = req.body;
	new Promise(function(resolve, reject) {
		if(avatar !== oldAvatar) {		//如果修改了图片
			var { temp, root, category } = uploadPaths;
			var fromPath = path.join(temp, avatar);
			var toPath = path.join(root, category, avatar);
			file.copy(fromPath, toPath)
				.then(() => file.unlink(fromPath))
				.then(() => file.unlink(path.join(root, oldAvatar)))
				.then(() => resolve());
		}
		else resolve();
	})
		.then(() => {
			avatar = avatar !== oldAvatar ? (uploadPaths.category + avatar) : avatar;
			var sqlStr = 'UPDATE `dt_category` SET `fid` = ?,`name` = ?,`avatar` = ? WHERE `id` = ?';
			return query(sqlStr, [ fid, name, avatar, id ]);
		})
		.then(() => res.send(httpResult.success(null, '修改成功')))
		.catch(message => res.send(httpResult.error(null, message)));
});

//react 
router.post('/getListByFid', function(req, res, next) {
	var fid = parseInt(req.body.fid);
	query('SELECT * FROM `dt_category` WHERE `fid` = ?;', [ fid ])
		.then(data => res.send(httpResult.success(data)))
		.catch(message => res.send(httpResult.error(null, message)));
});

module.exports = router;