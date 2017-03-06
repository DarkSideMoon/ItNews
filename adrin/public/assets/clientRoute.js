jQuery(document).ready(function($) {
    
    var news = '';
    var url = 'http://localhost:3000/api/';
    var newsElement = $(".news-info");

    function getNews(urlNews) {
        console.log('GET query for Codeguidanews');
        url += urlNews;

        $.getJSON(url, function (data) {
            news = JSON.stringify(data);

            $.each(news, function(key, value) {

            });
        });
    };

    getNews('codeguidanews/programming');
});