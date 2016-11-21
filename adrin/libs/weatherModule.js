var Wunderground = require('wundergroundnode');
var wunderground = new Wunderground('3d8696e7901cc512');


// Weahter structure 
var cityWeather = {
    fullName: "",
    countryIso: "",
    latitude: 0,
    longitude: 0,
    observation_time: "",
    local_epoch: "",
    weather: {
        condition: "",
        tempC: 0,
        feelslikeC: 0,
        relative_humidity: 0,
        wind_kph: 0,
        pressure_mb: 0,
        wind_string: ''
    }
};

function MyWeather(city, callback) {
    weatherConditions(city, callback);
}

function parseData(json) {

    cityWeather.fullName = json.current_observation.display_location.full;
    cityWeather.countryIso = json.current_observation.display_location.country_iso3166;
    cityWeather.latitude = json.current_observation.display_location.latitude;
    cityWeather.longitude = json.current_observation.display_location.longitude;
    cityWeather.observation_time = json.current_observation.observation_time;
    cityWeather.local_epoch = json.current_observation.local_epoch;

    cityWeather.weather.condition = json.current_observation.weather;
    cityWeather.weather.feelslikeC = json.current_observation.feelslike_c;
    cityWeather.weather.pressure_mb = json.current_observation.pressure_mb;
    cityWeather.weather.relative_humidity = json.current_observation.relative_humidity;
    cityWeather.weather.tempC = json.current_observation.temp_c;
    cityWeather.weather.wind_kph =  json.current_observation.wind_kph;
    cityWeather.weather.wind_string = json.current_observation.wind_string;

    return cityWeather;
}

function getWeatherConditions (city, callback) {
    wunderground.conditions().request(city, function(err, data) { 
        if (err) {
            console.log("An error has occured. Abort!");
            callback(err);
        }
        var jsonData = JSON.parse(JSON.stringify(data));
        parseData(jsonData);

        callback(cityWeather);
    });
}

module.exports.getWeatherConditions = getWeatherConditions;