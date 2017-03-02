'use strict';

const FeedUrl = 'http://itc.ua/';

let request = require('request');
let cheerio = require('cheerio');
let logger = require('./log');
let that;

let tmFeedUrl = 'http://itc.ua/';
let countOfPages = 0;
let posts = [];
let article = {
    id: '',
    source: '',
    title: '',
    href: '',
    category: '',
    timeCreating: '',
    author: '',
    comments: 0,
    views: 0,
    rating: 0
};
    
/*
    Object of ItcNewsFeed 
*/
function ItcNewsFeed(typeFeed, countPages) {
    tmFeedUrl += typeFeed;
    countOfPages = countPages;
    that = this;

    that.getNews = (callback) => {
        that.parseNewsFeed(callback);
    };

    /*
        Method for getting news from web site
    */
    that.parseNewsFeed = (callback) => {
        if(countOfPages == 0) {
            that.getWebPage(callback);
        } else {
            for (var i = 0, len = countOfPages; i <= len; i++) {
                tmFeedUrl += '/page/' + i;
                that.getWebPage(callback);
                // Something to do
                tmFeedUrl = FeedUrl + typeFeed;
            }
        }
    };

    /*
        Method for getting page html code
    */
    that.getWebPage = (callback) => {
        request(tmFeedUrl, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body); 
                that.parsePage($, callback);   
            } else {
                console.log("Error: " + error);
            }
        });    
    };


    /*
        Method for parsing each of post on array
    */    
    that.parsePage = ($, callback) => {
        $("main[id='content']").each(function(element, index) {
            let el = $(this); 
            let allPosts = el[0].children;
            
            for (var i = 0, len = allPosts.length; i < len; i++) {
                let post = allPosts[i];
                
                try {
                    if(i % 2 == 0 || i == 0) {
                        that.parsePost(post);
                    }
                } catch (error) {
                    logger.error('Couldnt parse post: ' + i);
                }
            }
        });
        
        that.showInfo(posts);
        
        if(callback != null)
            callback(posts);

        return posts;
    };

    /*
        Method for parsing post data
    */
    that.parsePost = (post) => {
        article = { };
        
        article.source = 'Itc.ua';
        article.id = post.attribs.class.match(/(post-)\d+/)[0];
        article.imageSource = post.children[0].children[0].children[0].children[1].attribs['data-original'];
        article.href = post.children[0].children[0].children[0].children[1].attribs.href;
        article.title = post.children[0].children[2].children[0].children[0].children[0].data;
        article.timeCreating = post.children[0].children[2].children[1].children[0].children[0].children[1].children[0].data;        
        article.comments = post.children[0].children[2].children[1].children[0].children[2].children[1].children[0].children[0].data;
        article.category = post.children[0].children[0].children[0].children[0].children[0].children[0].data;        
        article.author = post.children[0].children[2].children[1].children[0].children[1].children[1].children[0].data;        

        posts.push(article);
    };

    /*
        Method for showing info about post
    */
    that.showInfo = (posts) => {
        logger.info('Count of parse posts: ' + posts.length);
        
        for (var i = 0, len = posts.length; i < len; i++) {
            logger.info('---------------------');
            logger.info(posts[i].id);
            logger.info(posts[i].title);
            logger.info('Категория: ' + posts[i].category);
            logger.info('Автор: ' + posts[i].author);
            logger.info('---------------------');
        }
    };

}

module.exports = ItcNewsFeed;