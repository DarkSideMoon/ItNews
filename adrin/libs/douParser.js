'use strict';
// Constants
const DouUrl = 'https://dou.ua/';

// Libs
let cheerio = require('cheerio');
let request = require('request');
let logger = require('./log');

// Variables
let douNewsUrl = 'https://dou.ua/';
let typeOfNews = '';
let countOfPages = 0;

let that;
let posts = [];
let article = {
    source: '',
    title: '',
    href: '',
    category: '',
    timeCreating: '',
    author: '',
    imageSource: '',
    comments: 0,
    views: 0 
};

let event = {
    source: '',
    title: '',
    href: '',
    time: '',
    imageSource: '',
    price: '',
    place: '',
    text: '',
    comments: 0,
};

function DouNewsFeed(typeNewsFeed, countPages) {
    typeOfNews = typeNewsFeed;
    douNewsUrl += typeNewsFeed;
    countOfPages = countPages;
    that = this;

    this.getInfo = () => {
        this.parseNewsFeed();
    };

    /*
        Method to parse news or events
    */
    this.parseNewsFeed = () => {
        if(countOfPages == 0) {
            this.getWebPage();
        } else {
            for (var i = 1, len = countOfPages; i <= len; i++) {
                if(typeOfNews == 'lenta/') {
                    douNewsUrl += 'page/' + i;
                } else {
                    douNewsUrl += 'page-' + i + '/';
                }
                this.getWebPage();
                douNewsUrl = DouUrl + typeNewsFeed;
            }
        }
    };

    /*
        Method for getting body of page to parse
    */
    this.getWebPage = () => {
        request(douNewsUrl, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body); 
                if(typeOfNews == 'lenta/') {
                    that.parsePage($);
                } else {
                    parseEventPage($);
                }
            } else {
                console.log("Error: " + error);
            }
        });  
    };

    /*
        Method to actually parsing news pages
    */
    that.parsePage = ($) => {
        $("div[class='b-lenta']").each(function(element, index) {
            let el = $(this); 
            let allPosts = el[0].children;
            
            for (var i = 0, len = allPosts.length; i < len; i++) {
                let post = allPosts[i];
                
                try {
                    if(i % 2 == 1) {
                        that.parsePost(post);
                    }
                } catch (error) {
                    logger.error('Couldnt parse post: ' + i);
                }
            }
        });
        showNewsInfo(posts);
    };

    /*
        Method to actually parsing event pages
    */
    function parseEventPage($) {
        $("div[class='col50 m-cola']").each(function(element, index, callback) {
            let el = $(this); 
            let allPosts = el[0].children;
            
            for (var i = 0, len = allPosts.length; i < len; i++) {
                let post = allPosts[i];
                try {
                    if(i % 2 == 1) {
                        parseEventPost(post);
                    }
                } catch (error) {
                    logger.error('Couldnt parse post: ' + i);
                }
            }
        });
        showEventInfo(posts);
    };

    /*
        Method for parsing events
    */
    function parseEventPost(post) {
        event = { };
        
        event.source = 'Dou.ua';
        event.href = post.children[3].children[1].attribs.href;
        event.title = post.children[3].children[1].children[1].attribs.alt;
        event.imageSource = post.children[3].children[1].children[1].attribs.src;

        event.time = post.children[1].children[1].children[0].data;
        event.text = post.children[5].children[0].data.replace(/(\r\n|\n|\r|\t)/gm, ''); // replace for getting only text data

        // Ситуация когда нету коментариев или цены
        try {
            event.place = post.children[1].children[2].data.replace(/(\r\n|\n|\r|\t)/gm, '');
            event.price = post.children[1].children[3].children[0].data.replace(/(\r\n|\n|\r|\t)/gm, '');
            event.comments = post.children[5].children[1].children[0].data;
        } catch(error) {
            if(event.price == undefined)  {
                event.price = 'Не вказано';
            } else if(event.comments == undefined) {
                event.comments = 0;
            }
        }

        posts.push(event);
    };

    /*
        Method for parsing posts
    */
    that.parsePost = (post) => {
        article = { };
    
        article.source = 'Dou.ua';
        article.href = post.children[1].children[1].attribs.href; //;.children[0].children[1].attribs.href;
        article.title = post.children[1].children[1].children[1].attribs.alt;
        article.imageSource = post.children[1].children[1].children[1].attribs.src;

        let dateString = post.children[3].children[3].children[0].data;
        let timeString = post.children[3].children[3].children[1].children[0].data;   

        article.timeCreating = dateString + timeString;
        article.views = post.children[3].children[5].children[0].data;        
        article.author = post.children[3].children[1].children[0].data;       

        // Ситуация когда нету коментариев
        try {
            article.comments = post.children[5].children[1].children[0].data;
        } catch(error) {
            article.comments = 0;
        }
        article.category = post.children[7].children[1].children[0].data;        

        posts.push(article);
    };

    /*
        Method for showing info about post
    */
    function showNewsInfo(posts) {
        logger.info('Count of parse posts: ' + posts.length);
        for (var i = 0, len = posts.length; i < len; i++) {
            logger.info('---------------------');
            logger.debug(posts[i].title);
            logger.info('Категория: ' + posts[i].category);
            logger.info('Автор: ' + posts[i].author);
            logger.info('---------------------');
        }
    };

    /*
        Method for showing info about event in calendar
    */
    function showEventInfo(posts) {
        logger.info('Count of parse posts: ' + posts.length);
        
        for (var i = 0, len = posts.length; i < len; i++) {
            logger.info('---------------------');
            logger.info(posts[i].title);
            logger.info('Время: ' + posts[i].time);
            logger.info('Цена: ' + posts[i].price);
            logger.info('Место: ' + posts[i].place);
            logger.info('---------------------');
        }
    };
}

module.exports = DouNewsFeed;