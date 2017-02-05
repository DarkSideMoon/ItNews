'use strict';

// Node libs
let express = require('express');
let router = express.Router();

// My libs  
let ItcNewsFeed = require('./../libs/itcFeedParser');
let Weather = require('./../libs/weatherModule');
let DouNewsFeed = require('./../libs/douParser');

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
    douNewsFeedNews.getInfo(function(data) {
        res.json(data);
    });
});

// ==============================================
// 					ROUTING DATA DOU EVENTS
// ==============================================
router.get('/api/dounews/events', function(req, res, next) {
    let douNewsFeedNews = new DouNewsFeed('calendar/', 0);
    douNewsFeedNews.getInfo(function(data) {
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

module.exports = router;
