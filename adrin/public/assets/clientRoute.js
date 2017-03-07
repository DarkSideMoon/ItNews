'use strict';

jQuery(document).ready(function($) {
    
    let news = '';
    let url = 'http://localhost:3000/api/';
    let newsElement = $(".news-info");

    function getNews(urlNews) {
        console.log('GET query for Codeguidanews');
        url += urlNews;

        $.getJSON(url, function (data) {
            $.each(data, function(key, value) {
                let article = value.article;

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

    getNews('codeguidanews/programming');
});