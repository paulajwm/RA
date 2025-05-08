var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app1 = express();

// view engine setup
app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'ejs');

app1.use(logger('dev'));
app1.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app1.use(cookieParser());
app1.use(express.static(path.join(__dirname, 'public')));

app1.use('/', indexRouter);
app1.use('/users', usersRouter);
app1.use('/logs', serveIndex(path.join(__dirname, 'public/logs')));
app1.use('/logs', express.static(path.join(__dirname, 'public/logs')));

// catch 404 and forward to error handler
app1.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app1.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app1.listen(3000, () => {
  console.log(Server1 is running);
});

var app2 = express();

app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'ejs');

app2.use(logger('dev'));
app2.use(express.json());
app2.use(express.urlencoded({ extended: false }));
app2.use(cookieParser());
app2.use(express.static(path.join(__dirname, 'public')));

app2.use('/', indexRouter);
app2.use('/users', usersRouter);
app2.use('/logs', serveIndex(path.join(__dirname, 'public/logs')));
app2.use('/logs', express.static(path.join(__dirname, 'public/logs')));

app2.use(function(req, res, next) {
  next(createError(404));
});

app2.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app2.listen(3001, () => {
  console.log(Server2 is running);
});
