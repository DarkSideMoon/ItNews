var wundergroundAPI = require('./weatherModule');
var cron = require('cron');

// info
// http://stackoverflow.com/questions/20499225/i-need-a-nodejs-scheduler-that-allows-for-tasks-at-different-intervals

function taskWorker(params) {
    var cronJob = cron.job('*/30 * * * * *', function(){
        // perform operation e.g. GET request http.get() etc.
        console.info('cron job completed');
        
        getWeather();
    }); 
    
    cronJob.start();
};

function getWeather() {
    wundergroundAPI.getWeatherConditions('Kyiv', function(data) {
        console.log('***********************WEATHER****************************');
        console.log("Weather in " + data.fullName);
        console.log(data.observation_time);
        console.log("Temperature " + data.weather.tempC + " celsius");
        console.log("Pressure " + data.weather.pressure_mb );
        console.log("Conditions " + data.weather.condition);
        console.log('**********************************************************');
    });
};
 
module.exports.run = taskWorker;
