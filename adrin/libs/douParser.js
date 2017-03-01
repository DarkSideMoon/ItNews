'use strict';
// Constants
const DouUrl = 'https://dou.ua/';

// Libs
let cheerio = require('cheerio');
let request = require('request');
let logger = require('./log');
let Article = require('../models/article');
let Event = require('../models/event');

// Variables
let douNewsUrl = 'https://dou.ua/';
let typeOfNews = '';
let countOfPages = 0;

let that;
let posts = [];

function DouNewsFeed(typeNewsFeed, countPages) {
    typeOfNews = typeNewsFeed;
    douNewsUrl += typeNewsFeed;
    countOfPages = countPages;
    that = this;
    posts = []; // Clear arrary of news or events

    that.getNews = (callback) => {
        that.parseNewsFeed(callback);
    };

    /*
        Method to parse news or events
    */
    that.parseNewsFeed = (callback) => {
        if(countOfPages == 0) {
            that.getWebPage(callback);
        } else {
            for (var i = 1, len = countOfPages; i <= len; i++) {
                if(typeOfNews == 'lenta/') {
                    douNewsUrl += 'page/' + i;
                } else {
                    douNewsUrl += 'page-' + i + '/';
                }
                that.getWebPage(callback);
                douNewsUrl = DouUrl + typeNewsFeed;
            }
        }
    };

    /*
        Method for getting body of page to parse
    */
    that.getWebPage = (callback) => {
        request(douNewsUrl, function (error, response, body) {
            if (!error) {
                let $ = cheerio.load(body); 
                if(typeOfNews == 'lenta/') {
                    that.parsePage($, callback);
                } else {
                    that.parseEventPage($, callback);
                }
            } else {
                console.log("Error: " + error);
            }
        });  
    };

    /*
        Method to actually parsing news pages
    */
    that.parsePage = ($, callback) => {
        $("div[class='b-lenta']").each(function(element, index) {
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
        //that.showNewsInfo(posts);
        
        if(callback !== null)
            callback(posts);
        
        return posts;
    };

    /*
        Method to actually parsing event pages
    */
    that.parseEventPage = ($, callback) => {
        $("div[class='col50 m-cola']").each(function(element, index, callback) {
            let el = $(this); 
            let allPosts = el[0].children;
            
            for (let i = 0, len = allPosts.length; i < len; i++) {
                let post = allPosts[i];
                try {
                    if(typeof post.children !== "undefined" && post.children.length == 9) {
                        that.parseEventPost(post);
                    }
                } catch (error) {
                    logger.error('Couldnt parse post: ' + i);
                    logger.error('Error: ' + error);
                }
            }
        });
        //that.showEventInfo(posts);
        
        if(callback !== null)
            callback(posts);
        
        return posts;
    };

    /*
        Method for parsing events
    */
    that.parseEventPost = (post) => {
        let place = '';
        let price = '';
        let comments = '';
        let source = 'Dou.ua';
        let href = post.children[1].children[1].attribs.href;
        let title = post.children[1].children[1].children[1].attribs.alt;
        let imageSource = post.children[1].children[1].children[1].attribs.src;

        let time = post.children[3].children[1].children[0].data;
        let text = post.children[5].children[0].data.replace(/(\r\n|\n|\r|\t)/gm, ''); // replace for getting only text data

        // Ситуация когда нету коментариев или цены
        try {
            place = post.children[3].children[2].data.replace(/(\r\n|\n|\r|\t)/gm, '');
            price = post.children[3].children[3].children[0].data.replace(/(\r\n|\n|\r|\t)/gm, '');
            comments = post.children[5].children[1].children[0].data;
        } catch(error) {
            if(price == undefined)  {
                price = 'Не вказано';
            } else if(comments == undefined) {
                comments = 0;
            }
        }

        let event = new Event(source, title, href, time, imageSource, price, place, text, comments);
        posts.push(event);
    };

    /*
        Method for parsing posts
    */
    that.parsePost = (post) => {
        let comments = 0;
        let source = 'Dou.ua';
        let href = post.children[1].children[1].attribs.href; //;.children[0].children[1].attribs.href;
        let title = post.children[1].children[1].children[1].attribs.alt;
        let imageSource = post.children[1].children[1].children[1].attribs.src;

        let dateString = post.children[3].children[3].children[0].data;
        let timeString = post.children[3].children[3].children[1].children[0].data;   

        let timeCreating = dateString + timeString;
        let views = post.children[3].children[5].children[0].data;        
        let author = post.children[3].children[1].children[0].data;       

        // Ситуация когда нету коментариев
        try {
            comments = post.children[5].children[1].children[0].data;
        } catch(error) {
            comments = 0;
        }
        let category = post.children[7].children[1].children[0].data;
        
        let article = new Article(source, title, href, category, timeCreating, author, imageSource, comments, views, 0);
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

    /*
        Method for showing info about event in calendar
    */
    that.showEventInfo = (posts) => {
        logger.info('Count of parse posts: ' + posts.length);
        for (var i = 0, len = posts.length; i < len; i++) {
            logger.info(posts[i].getEventInfo());
            logger.debug('---------------------');
        }
    };
}

module.exports = DouNewsFeed;