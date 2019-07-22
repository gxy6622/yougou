var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper');

var router = express.Router();

//获取验证码
router.get('/getcode', function(req,res,next) {
	var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','B','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
	var code = '';
	for(var i = 1; i <= 4; i ++) {
		code += letters[Math.floor(Math.random()*letters.length)];
	}
	req.session.code = code;
	res.send(httpResult.success(code));
});
//手机登录
router.post('/phone', function(req,res,next) {
	var phone = req.body.phone;
	if(req.body.code.toUpperCase() === req.session.code) {
		query('CALL p_loginByPhone(?)',[ phone ])
			.then(results => {
				req.session.name = results[0][0].name;
				res.cookie('user', account);	//往cookie中写入用户登录状态
				res.send(httpResult.success());
			})
			.catch(message => res.send(httpResult.error(null,message)));
	}
});
//密码验证
router.post('/pwd', function(req,res,next) {
	var account = req.body.account;
	var pwd = req.body.pwd;
	query('CALL p_loginByPwd(?,?)',[ account, pwd ])
		.then(results => {
			if(results[0][0].result === '') {
				req.session.name = account;
				res.cookie('user', account);
				res.send(httpResult.success());
			} else res.send(httpResult.failure(null,results[0][0].result));
		})
		.catch(message => res.send(httpResult.error(null,message)));
});

module.exports = router;