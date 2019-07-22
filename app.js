var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');

var httpResult = require('./config').httpResult;
var sessionOptions = require('./config').sessionOptions;
var authPathsReg = require('./config').authPathsReg;

var categoryRouter = require('./routes/category.js');
var productRouter = require('./routes/product.js');
var userRouter = require('./routes/user.js');
var cartRouter = require('./routes/cart.js');
var detailRouter = require('./routes/detail.js');
var orderRouter = require('./routes/order.js');
var addressRouter = require('./routes/address.js');
var adminRouter = require('./routes/admin.js');
var profileRouter = require('./routes/profile.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));

//对登录进行验证
app.use('*', function(req, res, next) {
   var isAuthPath = authPathsReg.test(req.baseUrl);
   if(isAuthPath&&!req.session.name) res.send(httpResult.untoken());
   else next();
});

app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/login', userRouter);
app.use('/cart', cartRouter);
app.use('/detail', detailRouter);
app.use('/order', orderRouter);
app.use('/address', addressRouter);
app.use('/admin', adminRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
