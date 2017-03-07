'user strict';
// Constant
const codeguida = 'https://codeguida.com';
const newsUrl = 'https://codeguida.com/category/';

// Libs
let cheerio = require('cheerio');
let request = require('request');
let logger = require('./log');
let Article = require('../model/article');

// Variables
let codeguidaNewsUrl = '';
let typeOfNews = '';
let countOfPages = 0;

let that;
let posts = [];

function CodeGuidaNewsFeed(typeNewsFeed, countPages) {
    typeOfNews = typeNewsFeed;
    codeguidaNewsUrl = newsUrl;
    codeguidaNewsUrl += typeNewsFeed;
    countOfPages = countPages;
    that = this;
    posts = []; // Clear arrary of news or events

    that.getNews = (callback) => {
        that.parseNewsFeed(callback);
    }
    
    /*
        Method to parse news or events
    */
    that.parseNewsFeed = (callback) => {
        if(countOfPages == 0) {
            that.getWebPage(callback);
        }
    };

    /*
        Method for getting body of page to parse
    */
    that.getWebPage = (callback) => {
        request(codeguidaNewsUrl, function (error, response, body) {
            if (!error) {
                let $ = cheerio.load(body); 
                that.parsePage($, callback);
            } else {
                console.log("Error: " + error);
            }
        });  
    };

    /*
        Method to actually parsing news pages
    */
    that.parsePage = ($, callback) => {
        $("div[class='main-post-container']").each(function(element, index) {
            let el = $(this);
            let allPosts = el[0].children;
            
            for (let i = 0, len = allPosts.length; i < len; i++) {
                let post = allPosts[i];
                
                try {
                    if(i % 2 == 1) {
                        that.parsePost(post);
                    }
                } catch (error) {
                    logger.error('Couldnt parse post: ' + i);
                    logger.error('Error: ' + error);
                }
            }
        });
        
        that.showNewsInfo(posts);     
        
        if(callback !== null && typeof callback !== 'undefined')
            callback(posts);

        codeguidaNewsUrl = '';
        return posts;
    };

    /*
        Method for parsing posts
    */
    that.parsePost = (post) => {
        let source = 'Codeguida.com';
        
        let imageSource = codeguida + post.children[1].children[1].children[1].children[1].attribs.src;
        let title = post.children[1].children[3].children[0].children[0].data;
        let href = codeguida + post.children[1].children[3].attribs.href;

        let comments = post.children[1].children[5].children[1].children[0].children[0].data.trim();
        let views = post.children[1].children[5].children[3].children[0].data.trim();
        let likes = post.children[1].children[5].children[5].children[0].data.trim();

        let category = 'it-news';
        
        let article = new Article(source, title, href, category, '', '', imageSource, comments, views, likes);
        posts.push(article);
    };

    /*
        Method for showing info about post
    */
    that.showNewsInfo = (posts) => {
        logger.info('Count of parse posts: ' + posts.length);
        for (var i = 0, len = posts.length; i < len; i++) {
            logger.info(posts[i].getArticleInfo());
            logger.debug('---------------------');
        }
    };
}

module.exports = CodeGuidaNewsFeed;