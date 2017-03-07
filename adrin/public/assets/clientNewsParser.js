'use strict';

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

jQuery(document).ready(function($) {
    
    let news = '';
    let url = 'http://localhost:3000/api/';
    let newsElement = $(".news-info");
    let newsHeaderElement = $("#news-header");

    //let name = getUrlParameter('name');
    //let type = getUrlParameter('type');
    let name = getParameterByName('name');
    let arr = name.split('?type=');

    function getNews(urlNews) {
        console.log('GET query for Codeguidanews');
        url += urlNews;

        $.getJSON(url, function (data) {
            $.each(data, function(key, value) {
                let article = value.article;
                let newsHeader = 'News from <a id="news-name" href="' + article.newsSource + '"> ' + article.newsSource + ' </a>';

                if(key == 0) { newsHeaderElement.append(newsHeader); }
                newsElement.append('<h5>' + 'Title: ' + "<a href='" + article.href + "'>" + article.title + '</a></h5>');
                newsElement.append('<p style="float: center;" width="200">' +
                    '<img style="margin: 5px;" width="150" height="150" src=' + article.imageSource + '>'
                    + '</p>');
                newsElement.append('<span>' + 'VIews: ' + article.views + '</span></br>');
                newsElement.append('<span>' + 'Likes: ' + article.likes + '</span></br>');
                newsElement.append('<span>' + 'Comments: ' + article.comments + '</span></br>');
                newsElement.append('</br>');
            });
        });
    };

    if(arr[0] === 'codeguida' && arr[1] === 'programming') {
        getNews('codeguidanews/programming');
    } else if(arr[0] === 'codeguida' && arr[1] === 'it_news') {
        getNews('codeguidanews/it_news');
    }
});