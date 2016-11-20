var express = require('express');
var router = express.Router();

// ==============================================
// 					ROUTING
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

module.exports = router;
