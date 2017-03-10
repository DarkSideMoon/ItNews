'use strict';

// Constant
const db = 'itnews';
const connectionString = 'mongodb://localhost:27017/' + db;

// Variables
let that;
let logger = require('./../libs/log');
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let User = require('./../model/user');


function MongoManager() {
    that = this;

    that.checkConnection = () => {
        MongoClient.connect(connectionString, function (err, db) {
            if (err) {
                logger.error('Unable to connect to the mongoDB server. Error:', err);
                return false;
            } else {
                //HURRAY!! We are connected. :)
                logger.info('Connection established to', connectionString);
                return true;
            }
        });
    };

    that.openDbConnection = (callback) => {
        MongoClient.connect(connectionString, function (err, db) {
            if (err) {
                logger.error('Unable to connect to the mongoDB server. Error:', err);
                return null;
            } else {
                //HURRAY!! We are connected. :)
                logger.info('Connection established to', connectionString);
                
                if(callback !== null)
                    callback(db);
            }
        });
    };

    that.getUsers = () => {
        that.openDbConnection(function(db) { 
            if(db !== null) {
                let collectionUsers = db.collection('users');

                //We have a cursor now with our find criteria
                let cursor = collectionUsers.find({});
                cursor.limit(10);
                cursor.skip(0);
                
                cursor.each(function (err, data) {
                    if (err) {
                        logger.erro(err);
                    } else {
                        logger.info('Fetched users:', data);
                    }
                });
                db.close();
            }
        });
    };
    
    that.insertUser = () => {
        that.openDbConnection(function(db) { 
            if(db !== null) {
                let collectionUsers = db.collection('users');
                let user1 = new User('User', 'user@gmail.com', Date.now, 
                [ 
                    { id: 1, name: 'C#' }, 
                    { id: 2, name: '.Net' }
                ]);
                
                let user2 = new User('Admin', 'admin@i.ua', Date.now, 
                [ 
                    { id: 1, name: 'C#' }, 
                    { id: 2, name: '.Net' },
                    { id: 3, name: 'ASP.Net' },
                    { id: 4, name: '.JavaScript' },
                    { id: 5, name: '.Node JS' },
                    { id: 6, name: 'Data bases' }
                ]);

                collectionUsers.insert([user1, user2], function (err, result) {
                    if (err) {
                        logger.error(err);
                    } else {
                        logger.info('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    }
                });

                db.close();
            }
        });
    };

}

module.exports = MongoManager;
