'user strict';
// Constant
const codeguida = 'https://codeguida.com/';

// Libs
let cheerio = require('cheerio');
let request = require('request');
let logger = require('./log');
let Article = require('../models/article');

// Variables
let codeguidaNewsUrl = 'https://codeguida.com/category/';
let typeOfNews = '';
let countOfPages = 0;

let that;
let posts = [];

function CodeGuidaNewsFeed(typeNewsFeed, countPages) {
    typeOfNews = typeNewsFeed;
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
}

module.exports = CodeGuidaNewsFeed;