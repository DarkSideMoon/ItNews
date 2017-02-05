'use strict';

// Libs
let Weather = require('./weatherModule');
let cron = require('cron');
let that;
let jobInterval = '';

// info
// http://stackoverflow.com/questions/20499225/i-need-a-nodejs-scheduler-that-allows-for-tasks-at-different-intervals
function Scheduler(interval) {
    that = this;
    this.jobInterval = interval;

    that.runTaskWorker = () => {
        var cronJob = cron.job(this.jobInterval, function(){
            // perform operation e.g. GET request http.get() etc.
            console.info('cron job completed');
            that.getWeather();
        }); 
        
        cronJob.start();
    };

    that.getWeather = () => {
        let weather = new Weather('Kyiv');
        weather.getWeatherConditions(function(data) {
            console.log('***********************WEATHER****************************');
            console.log("Weather in " + data.fullName);
            console.log(data.observation_time);
            console.log("Temperature " + data.weather.tempC + " celsius");
            console.log("Pressure " + data.weather.pressure_mb );
            console.log("Conditions " + data.weather.condition);
            console.log('**********************************************************');
        });
    };
}
 
module.exports = Scheduler;
