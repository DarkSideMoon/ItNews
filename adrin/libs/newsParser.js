'use strict';

let request = require('request');
let logger = require('./log');
let UrlBuilder = require('./newsBuilder');
let NewsUrl = require('./newsUrl');

let typeOfHeadlines = '';
let typeOfNews = '';

let that;
let apiKey = '0c249341c2ea4e33a340a5bf55cec644';
let url = '';
let posts = [];

function NewsAPI(typeNews, typeHeadlines) {
    typeOfHeadlines = typeHeadlines;
    typeOfNews = typeNews;
    that = this;

    let urlBuilder = new UrlBuilder(apiKey, typeOfNews, typeOfHeadlines);
    let newsUrl = new NewsUrl(urlBuilder);

    url = newsUrl.construct(urlBuilder);

    that.getNews = () => {
        that.getData();
    };

    that.getData = () => {
        request(url, function (error, response, json) {
            if (!error) {
                let jsonData = JSON.parse(json);
                posts = jsonData.articles;

                posts.forEach(function (value, index) {
                    logger.info(value.title);
                    logger.info('Author: ' + value.author);
                    logger.info('Published: ' + value.publishedAt);
                    console.log();
                });

            } else {
                console.log("Error: " + error);
            }
        });    
    };
}

module.exports = NewsAPI;