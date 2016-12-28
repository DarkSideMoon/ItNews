var express = require('express');
var router = express.Router();

// news libs 
var ItcNewsFeed = require('./../libs/itcFeedParser');
var wundergroundAPI = require('./../libs/weatherModule');

// ==============================================
// 					ROUTING VIEWS
// ==============================================

/* GET welcome page. */
router.get('/', function(req, res, next) {
	var pathToFile = __dirname + '/../views/index.html';
    res.render(pathToFile);
});

/* GET about page. */
router.get('/about', function(req, res, next) {
	var pathToFile = __dirname + '/../views/about.html';
    res.render(pathToFile);
});

/* GET sign in install. */
router.get('/install', function(req, res, next) {
	var pathToFile = __dirname + '/../views/install.html';
    res.render(pathToFile);
});

/* GET sign up page. */
/*
router.get('/signup', function(req, res, next) {
	var pathToFile = __dirname + '/../views/signup.html';
    res.render(pathToFile);
});
*/

// ==============================================
// 					ROUTING DATA
// ==============================================
router.get('/api/itcnews/blog', function(req, res, next) {
    var itcFeedNews = new ItcNewsFeed('blogs', 0);
    /*
    itcFeedNews.getNewsAsync(function(data) {
        res.json(data);
    });
    */
});

router.get('/api/weather', function(req, res, next) {
    wundergroundAPI.getWeatherConditions('Kyiv', function(data) {
        res.json(data);
    });
});

module.exports = router;
