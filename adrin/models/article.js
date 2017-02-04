// ==============================================
// 		       Model class for article
// ==============================================
'use strict';

let that;
let article = {
    newsSource: '',
    title: '',
    href: '',
    category: '',
    timeCreating: '',
    author: '',
    imageSource: '',
    comments: 0,
    views: 0 
};

function Article(newsSource, title, href, category, timeCreating, author, imageSource, comments, views) {
    this.article = { };
    this.article.newsSource = newsSource;
    this.article.title = title;
    this.article.category = category;
    this.article.timeCreating = timeCreating;
    this.article.author = author;
    this.article.imageSource = imageSource;
    this.article.comments = comments;
    this.article.views = views;
    that = this;

    that.getArticleInfo = () => {
        return this.article.title +
        '\nCategory: ' + this.article.category + 
        '\nAuthor: ' + this.article.author + 
        '\nViews: ' + this.article.views + 
        '\nComments: ' + this.article.comments;
    }

    that.getArticle = () => {
        return this.article;
    }
}

module.exports = Article;