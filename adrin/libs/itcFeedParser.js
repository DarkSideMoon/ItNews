'use strict';

const FeedUrl = 'http://itc.ua/';

let request = require('request');
let cheerio = require('cheerio');
let logger = require('./log');
let that;

let tmFeedUrl = 'http://itc.ua/';
let countOfPages = 0;
let posts = [];
let Article = require('../model/article');
    
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
                    logger.error('Error: ' + error);
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
        let source = 'Itc.ua';
        //let id = post.attribs.class.match(/(post-)\d+/)[0];
        let imageSource = post.children[0].children[0].children[0].children[1].attribs['data-bg'];
        let href = post.children[0].children[0].children[0].children[1].attribs.href;
        let title = post.children[0].children[2].children[0].children[0].children[0].data;
        let timeCreating = post.children[0].children[2].children[1].children[0].children[0].children[1].children[0].data;        
        let comments = post.children[0].children[2].children[1].children[0].children[2].children[1].children[0].children[0].data;
        let category = post.children[0].children[0].children[0].children[0].children[0].children[0].data;        
        let author = post.children[0].children[2].children[1].children[0].children[1].children[1].children[0].data;        

        let article = new Article(source, title, href, category, timeCreating, author, imageSource, comments, 0, 0);
        posts.push(article);
    };

    /*
        Method for showing info about post
    */
    that.showInfo = (posts) => {
        logger.info('Count of parse posts: ' + posts.length);
        for (var i = 0, len = posts.length; i < len; i++) {
            logger.info(posts[i].getArticleInfo());
            logger.debug('---------------------');
        }
    };

}

module.exports = ItcNewsFeed;