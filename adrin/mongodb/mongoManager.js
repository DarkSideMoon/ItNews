'use strict';

// Constant
const db = 'itnews';
const connectionString = 'mongodb://localhost:27017/' + db;

// Variables
let that;
let logger = require('./../libs/log');
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;


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

}

module.exports = MongoManager;
