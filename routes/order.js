var express = require('express');
var httpResult = require('../config').httpResult;
var query = require('../utils/dbHelper');

var router = express.Router();
 
 router.post('/list', function(req,res,next) {
	var orderId = req.body.orderId;
	 query('CALL p_getOrderInfo(?);', [ orderId ] )
		.then(results => {
			res.send(httpResult.success(results));
		})
		.catch(message => res.send(httpResult.error(null,message)));
 });
 
 
module.exports = router;