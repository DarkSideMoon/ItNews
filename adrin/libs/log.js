var winston = require('winston');
winston.emitErrs = true;
var ENV = 'development'; //process.env.NODE_ENV;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'silly',
            // IF You start app from console change path ./logs/all-logs.log and create folder with file
            filename: './adrin/logs/all-logs.log', 
            handleExceptions: true,
            json: true,
            //maxsize: 5242880, //5MB
            //maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: (ENV == 'development') ? 'debug' : 'error',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};