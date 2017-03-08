var mongoose = require('mongoose');
// для работы в с фун-ми и callback
// позволяет делать async последовательности вызовов:
// серийные, паралельные, работает с масивами
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createNews//createContentTEST
], function (err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});


function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('../adrin/models/user');
    require('../adrin/models/content/newsDou');
    require('../adrin/models/content/newsBase');
    // проходим по всем моделям и для каждой из них вызвать ensureIndexes
    // гарантирует как только все индексы будут созданы вызоветься callback
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        {nick: 'Василиса', password: 'qwerty', email: 'v123@ukr.net'}
    ];

    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createNews(callback) {
    var news = [
        {url: 'https://dou.ua/lenta/articles/2016-summary/', name: 'итоги 2016'},
        {url: 'https://dou.ua/lenta/digests/information-security-digest-4/', name: 'Information Security дайджест #4'}
    ];

    async.each(news, function (newsData, callback) {
        var news = new mongoose.models.NewsDou(newsData);

        //var user1 = new mongoose.models.User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});
        //var user2 = new mongoose.models.User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});

        //series.users[0] = user1;
        //series.users.push({nick: 'Dan', password: '1', email: 'lola@ukr.net'});
        //series.users.push(user2);

        news.save(callback);
    }, callback);
}

