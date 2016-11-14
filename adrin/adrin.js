// ==============================================
// 					CONSTANS
// ==============================================
const hostname = 'localhost'
const port = 3000;

// ==============================================
// 					BASE SETUP 
// ==============================================

// Server 
var express = require('express');
var app = express();

// LIBS
var path = require('path');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// MY LIBS
var logger = require('./libs/log');

// CONFIG
// view engine setup


app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// OVERRIDE EXPRESS STANDART LOGGER 
logger.debug("Overriding 'Express' logger");
app.use(morgan({ "stream": logger.stream }));

//app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ==============================================
// 					ERROR HANDLERS
// ==============================================
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// ==============================================
// 					START THE SERVER
// ==============================================
app.listen(port, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});