"use strict";

var createError = require('http-errors');

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var fileUpload = require('express-fileupload');

var expressSession = require('express-session');

var MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');

var app = express(); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(expressSession({
  secret: 'secret',
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/baiviet'
  })
}));
app.use('/', indexRouter);
app.use('/users', usersRouter); // the uploaded file object
// app.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 },
// }));
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;