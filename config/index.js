var path = require('path');

exports.httpResult = {
        success: function(data, message) {
                data = data || null;
                message = message || '';
                return { status: 200, data: data, message: message};
        },
        failure: function(data, message) {
                data = data || null;
                message = message || '';
                return { status: 199, data: data, message: message };
        },
        error: function(data, message) {
                data = data || null;
                message = message || '';
                return { status: 500, data: data, message: message };
        },
        untoken: function(data, message) {
                data = data || null;
                message = message || '';
                return { status: 401, data: data, message: message };
        },
        notFond: function(data, message) {
                data = data || null;
                message = message || '';
                return { status: 401, data: data, message: message };
        }
};

exports.sessionOptions = {
  secret: 'ugou',
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 20 },
  rolling: true,
  saveUninitialized: false,
  resave: false
};

exports.authPathsReg = /^\/(detail|profile|cart|address|order)/;

exports.uploadPaths = {
	temp: path.join(__dirname, '../temp'),
	root: path.join(__dirname, '../public'),
	category: '/images/category/',
	product: '/images/product/',
	detail: '/images/detail/',
};