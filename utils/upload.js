var uploadPaths = require('../config').uploadPaths;
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, uploadPaths.temp);
	},
	filename: function(req, file, cb) {
		var arr = file.originalname.split('.'),
			extName = arr[arr.length - 1],
			name = (new Date()).getTime();
		cb(null, `${ name }.${ extName }`);	
	}
});

module.exports = multer({ storage: storage });