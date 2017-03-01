// ==============================================
// 					CONSTANS
// ==============================================
const hostname = 'localhost'
const port = 3000;

// Itc.ua news
const typeItcFeed =  {
    news: 'news', // Новости
    reviews: 'articles', // Обзоры
    articles: 'stati', // Статьи
    video: 'video', // Видео
    blogs: 'blogs' // Блоги
};

// News API
const typeOfNews =  {
    engadget: 'engadget', // News
    polygon: 'polygon', // Game news
    reddit: 'reddit-r-all', // Reddit
};

const typeOfHeadlines = {
    top: 'top',
    latest: 'latest'
};

// Dou ua 
const douNewsType = {
    news: 'lenta/',
    calendar: 'calendar/'
};

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
var wunderground = require('./libs/wunParser');
var wundergroundAPI = require('./libs/weatherModule');
var Scheduler = require('./libs/scheduler');

// Parsers
var ItcNewsFeed = require('./libs/itcFeedParser');
var DouNewsFeed = require('./libs/douParser');
var CodeGuidaParser = require('./libs/codeguidaParser');
var NewsParser = require('./libs/newsParser');


// ROUTES 
var routes = require('./routes/index');

// CONFIG
// view engine setup
//app.set('view engine', 'html');
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

app.use('/', routes);

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

  //wunderground.getWundergroundWeather();

  var scheduler = new Scheduler('*/30 * * * * *');
  scheduler.runTaskWorker();;
  console.log();

/*
  var codeguidaParser = new CodeGuidaParser('it_news', 0);
  codeguidaParser.getNews(function(data) {
    data.forEach(function(item) {
      logger.debug(item.getArticleInfo());
    });
  });
*/

  var codeguidaParser = new CodeGuidaParser('it_news', 0);
  codeguidaParser.getNews();


/*
   var itcFeedNews = new ItcNewsFeed(typeItcFeed.news, 0);
   
   itcFeedNews.getNews(function(data) {
     data.forEach(function(item) {
       console.log(item);
     });
    });
*/
   //var itcFeedNews = new ItcNewsFeed(typeItcFeed.blogs, 0);
   //itcFeedNews.getNews();

  //var news = new NewsParser(typeOfNews.engadget, typeOfHeadlines.latest);
  //news.getNews();

  //var news2 = new NewsParser(typeOfNews.reddit, typeOfHeadlines.top);
  //news2.getNews();
  
   //var douNewsFeedNews = new DouNewsFeed(douNewsType.calendar, 1);
   //douNewsFeedNews.getNews();

   //var douNewsFeedEvents = new DouNewsFeed(douNewsType.calendar, 2);
   //douNewsFeedEvents.getNews();

});