'use strict';

// Node libs
let express = require('express');
let router = express.Router();

// My libs  
let ItcNewsFeed = require('./../libs/itcFeedParser');
let Weather = require('./../libs/weatherModule');
let DouNewsFeed = require('./../libs/douParser');
let CodeGuidaParser = require('./../libs/codeguidaParser');

let MongoManager = require('./../mongodb/mongoManager'); 

// ==============================================
// 					ROUTING VIEWS
// ==============================================

/* GET welcome page. */
router.get('/', function(req, res, next) {
	let pathToFile = __dirname + '/../views/index.html';
    res.render(pathToFile);
});

/* GET about page. */
router.get('/about', function(req, res, next) {
	let pathToFile = __dirname + '/../views/about.html';
    res.render(pathToFile);
});

/* GET sign in install. */
router.get('/install', function(req, res, next) {
	let pathToFile = __dirname + '/../views/install.html';
    res.render(pathToFile);
});

/* GET page of news */
router.get('/news?:name?:type', function(req, res, next) {
	let pathToFile = __dirname + '/../views/news.html';
    let test1 = req.route;
    let test2 = req.query.name;
    res.render(pathToFile);
});

/* GET page of news */
/*
TODO: make with two parameters
-------------Can work with this two params but actually doesn't load css styles. Why???---------- 
router.get('/news/:name/:type', function(req, res, next) {
	let pathToFile = __dirname + '/../views/news.html';
    let test1 = req.route;
    let test2 = req.params.name;
    let test3 = req.params.type;
    res.render(pathToFile);
});
*/

// ==============================================
// 					ROUTING USERS
// ==============================================
router.get('/api/user/info?:id', function(req, res, next) {
    let id = req.query.id;

    let managerDb = new MongoManager();
    res.render('');
});


// ==============================================
// 					ROUTING DATA ITC NEWS
// ==============================================
router.get('/api/itcnews/blog', function(req, res, next) {
    let itcFeedNews = new ItcNewsFeed('blogs', 0);
    itcFeedNews.getNews(function(data) {
        res.json(data);
    });
});

router.get('/api/itcnews/video', function(req, res, next) {
    let itcFeedNews = new ItcNewsFeed('video', 0);
    itcFeedNews.getNews(function(data) {
        res.json(data);
    });
});

router.get('/api/itcnews/stati', function(req, res, next) {
    let itcFeedNews = new ItcNewsFeed('stati', 0);
    itcFeedNews.getNews(function(data) {
        res.json(data);
    });
});

router.get('/api/itcnews/articles', function(req, res, next) {
    let itcFeedNews = new ItcNewsFeed('articles', 0);
    itcFeedNews.getNews(function(data) {
        res.json(data);
    });
});

router.get('/api/itcnews/news', function(req, res, next) {
    let itcFeedNews = new ItcNewsFeed('news', 0);
    itcFeedNews.getNews(function(data) {
        res.json(data);
    });
});

// ==============================================
// 					ROUTING DATA DOU NEWS
// ==============================================
router.get('/api/dounews/news', function(req, res, next) {
    let douNewsFeedNews = new DouNewsFeed('lenta/', 0);
    douNewsFeedNews.getNews(function(data) {
        res.json(data);
    });
});

// ==============================================
// 					ROUTING DATA DOU EVENTS
// ==============================================
router.get('/api/dounews/events', function(req, res, next) {
    let douNewsFeedNews = new DouNewsFeed('calendar/', 0);
    douNewsFeedNews.getNews(function(data) {
        res.json(data);
    });
});

// ==============================================
// 					ROUTING DATA WEATHER
// ==============================================
router.get('/api/weather', function(req, res, next) {
    let weather = new Weather('Kyiv');
    weather.getWeatherConditions(function(data) {
        res.json(data);
    });
});


// ==============================================
// 					ROUTING DATA CODEGUIDA NEWS
// ==============================================
router.get('/api/codeguidanews/programming', function(req, res, next) {
    var codeguidaParser = new CodeGuidaParser('programming', 0);
    codeguidaParser.getNews(function(data){
        res.json(data);
    });
});

router.get('/api/codeguidanews/it_news', function(req, res, next) {
    var codeguidaParser = new CodeGuidaParser('it_news', 0);
    codeguidaParser.getNews(function(data){
        res.json(data);
    });
});

module.exports = router;
