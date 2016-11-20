/*
    Parse weather from website wunderground
*/
'use strict';

let countryCode = 'UKKK'; // Code of country. Can find in url of wunderground in you country 
let request = require('request');
let cheerio = require('cheerio');
let WeatherUrl = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + countryCode;

// Test example 
// Parse weather
let getWundergroundWeather = () => {
    request(WeatherUrl, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);
            parseWeather($);   
        } else {
            console.log("Error: " + error);
        }
    });  
};    

let parseWeather = ($) => {
    let temperature = $("[data-variable='temperature'] .wx-value").html();
    let conditions = $("[data-variable='condition'] .wx-value").html();
    let pressure = $("[data-variable='pressure'] .wx-value").html();
    let pressureUnit = $("[data-variable='pressure'] .wx-unit").html();
            
    let sunRise = $("#cc-sun-rise").html();
    let sunSet = $("#cc-sun-set").html();
    let timeUpdate = $("#update-time").html();
            
    let city = getCity($);

    // Show weather.
    // Test example
    console.log('***********************WEATHER****************************');
    console.log("Weather in " + city);
    console.log("Updated " + timeUpdate);
    console.log("Temperature " + temperature + " celsius");
    console.log("Pressure " + pressure + " " + pressureUnit);
    console.log("Conditions " + conditions);
    console.log("Sunrise " + sunRise + " AM");
    console.log("Sunset " + sunSet + " PM");
    console.log('**********************************************************');
};

let getCity = ($) => {
    var txt = '';
    $('.city-nav-header').filter(function(){
        var data = $(this);
        txt = data.text().trim();
     });  
     return txt;
};

module.exports.getWundergroundWeather = getWundergroundWeather;
