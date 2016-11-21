// ==============================================
// 		        Builder pattern
// ==============================================
// Builder url for news api 

'use strict';
let apiUrl = 'https://newsapi.org/v1/articles?';
let and = '&';

UrlBuilder = (apiKey, typeOfNews, typeOfHeadlines) => {
    let url = '';

    this.buildSource = function() {
        url = apiUrl;
        url += 'source=' + typeOfNews;
    };
 
    this.buildSortBy = function() {
        url += and + 'sortBy=' + typeOfHeadlines;    
    };

    this.buildApiKey = function() {
        url += and + 'apiKey=' + apiKey;
    };

    this.get = function() {
        return url;
    };
}

module.exports = UrlBuilder;