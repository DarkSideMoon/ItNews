'use strict';

const DouUrl = 'https://dou.ua/';

let cheerio = require('cheerio');
let request = require('request');
let logger = require('./log');

let douNewsUrl = 'https://dou.ua/';
let typeOfNews = '';
let countOfPages = 0;

let posts = [];
var article = {
    source: '',
    title: '',
    href: '',
    category: '',
    timeCreating: '',
    author: '',
    imageSource: '',
    comments: 0,
};

var calendar = {
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

    //getWebPage();
    // Вынести логику в метод parseNewsFeed и вызывать его
    if(countOfPages == 0) {
        getWebPage();
    } else {
        //https://dou.ua/lenta/page/2/
        for (var i = 1, len = countOfPages; i <= len; i++) {
            if(typeOfNews == 'lenta/') {
                douNewsUrl += 'page/' + i;
            } else {
                douNewsUrl += 'page-' + i + '/';
            }
            

            getWebPage();
            
            // Something to do
            douNewsUrl = DouUrl + typeNewsFeed;
        }
    }
} 

function parseNewsFeed() {
    

}

function getWebPage() {
    request(douNewsUrl, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body); 
            if(typeOfNews == 'lenta/') {
                parsePage($);
            } else {
                parseCalendarPage($);
            }
        } else {
            console.log("Error: " + error);
        }
    });    
};

function parsePage($) {

    $("div[class='b-lenta']").each(function(element, index) {
        let el = $(this); 
        let allPosts = el[0].children;
        
        for (var i = 0, len = allPosts.length; i < len; i++) {
            let post = allPosts[i];
            
            try {
                if(i % 2 == 1) {
                    parsePost(post);
                }
            } catch (error) {
                logger.error('Couldnt parse post: ' + i);
            }
        }
    });
    logger.info('Count of parse posts: ' + posts.length);
    
    for (var i = 0, len = posts.length; i < len; i++) {
        logger.info('---------------------');
        logger.info(posts[i].title);
        logger.info('Категория: ' + posts[i].category);
        logger.info('Автор: ' + posts[i].author);
        logger.info('---------------------');
    }

}

function parseCalendarPage($) {

    $("div[class='col50 m-cola']").each(function(element, index) {
        let el = $(this); 
        let allPosts = el[0].children;
        
        for (var i = 0, len = allPosts.length; i < len; i++) {
            let post = allPosts[i];
            
            try {
                if(i % 2 == 1) {
                    parseCalendarPost(post);
                }
            } catch (error) {
                logger.error('Couldnt parse post: ' + i);
            }
        }
    });
    logger.info('Count of parse posts: ' + posts.length);
    
    for (var i = 0, len = posts.length; i < len; i++) {
        logger.info('---------------------');
        logger.info(posts[i].title);
        logger.info('Время: ' + posts[i].time);
        logger.info('Цена: ' + posts[i].price);
        logger.info('Место: ' + posts[i].place);
        logger.info('---------------------');
    }

}

function parseCalendarPost(post) {
    calendar = { };
    
    calendar.source = 'Dou.ua';
    calendar.href = post.children[3].children[1].attribs.href; //;.children[0].children[1].attribs.href;
    calendar.title = post.children[3].children[1].children[1].attribs.alt;
    calendar.imageSource = post.children[3].children[1].children[1].attribs.src;

    calendar.time = post.children[1].children[1].children[0].data;
    calendar.text = post.children[5].children[0].data.replace(/(\r\n|\n|\r|\t)/gm, '');

    // Ситуация когда нету коментариев или цены
    try {
        calendar.place = post.children[1].children[2].data.replace(/(\r\n|\n|\r|\t)/gm, '');
        calendar.price = post.children[1].children[3].children[0].data.replace(/(\r\n|\n|\r|\t)/gm, '');
        calendar.comments = post.children[5].children[1].children[0].data;
    } catch(error) {
        if(calendar.price == undefined)  {
            calendar.price = 'Не вказано';
        } else if(calendar.comments == undefined) {
            calendar.comments = 0;
        }
    }

    posts.push(calendar);
}

function parsePost(post) {
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
}

module.exports = DouNewsFeed;
