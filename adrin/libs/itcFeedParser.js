'use strict';

const FeedUrl = 'http://itc.ua/';

let request = require('request');
let cheerio = require('cheerio');
let logger = require('./log');

let tmFeedUrl = 'http://itc.ua/';
let countOfPages = 0;
let posts = [];
var article = {
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


function ItcNewsFeed(typeFeed, countPages) {
    tmFeedUrl += typeFeed;
    countOfPages = countPages;
    
    // Вынести логику в метод parseFeed и вызывать его
    if(countOfPages == 0) {
        getWebPage();
    } else {
        // http://itc.ua/blogs/page/3/
        for (var i = 0, len = countOfPages; i <= len; i++) {
            tmFeedUrl += '/page/' + i;

            getWebPage();
            
            // Something to do
            tmFeedUrl = FeedUrl + typeFeed;
        }
    }
} 

function parseFeed() {
    

}

function getWebPage() {
    request(tmFeedUrl, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body); 
            parsePage($);    
        } else {
            console.log("Error: " + error);
        }
    });    
};

function parsePage($) {
    $("main[id='content']").each(function(element, index) {
        let el = $(this); 
        let allPosts = el[0].children;
        
        for (var i = 0, len = allPosts.length; i < len; i++) {
            let post = allPosts[i];
            
            try {
                if(i % 2 == 0 || i == 0) {
                    parsePost(post);
                    
                    //logger.info('Parse post: ' + article.id);
                }
            } catch (error) {
                logger.error('Couldnt parse post: ' + i);
            }
        }
    });
    logger.info('Count of parse posts: ' + posts.length);
    
    for (var i = 0, len = posts.length; i < len; i++) {
        logger.info('---------------------');
        logger.info(posts[i].id);
        logger.info(posts[i].title);
        logger.info('Категория: ' + posts[i].category);
        logger.info('Автор: ' + posts[i].author);
        logger.info('---------------------');
    }

}

function parsePost(post) {
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

}

module.exports =  
    //ItcNewsFeed;
//module.exports = parseFeed();