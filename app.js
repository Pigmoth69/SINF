var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bb = require('express-busboy');
var bodyParser = require('body-parser');
var session = require('express-session');
var hbs = require('hbs');

var routes = require('./routes/index');
var profile = require('./routes/profile');
var login = require('./routes/login');
var cart = require('./routes/cart');
var payment = require('./routes/payment');
var product = require('./routes/product');
var order = require('./routes/order');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public','images','ico', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'sequoia'}));
app.use(express.static(path.join(__dirname, 'public')));
bb.extend(app, {
  upload: true,
  allowedPath: /./
});


app.use('/', routes);
app.use('/profile', profile);
app.use('/login', login);
app.use('/cart',cart);
app.use('/product',product);
app.use('/payment', payment);
app.use('/order', order);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// create necessary dirs
/*
dir = path.join(__dirname, 'images');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}
dir = path.join(dir, 'clubs');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('404', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
