'use strict';

let should = require('should');
let assert = require('chai').assert;
let wundergroundAPI = require('../libs/weatherModule.js');

describe("weather module", () => {
	describe('#getWeatherConditions()', () => {

		it("get info data from wunderground server", () => {
			let expectedFullName = '';
			let expectedCountryISO = 0;
			let expectedLongitude = 0;
			let expectedLatitude = 0;

/*
			wundergroundAPI.getWeatherConditions('Kyiv', (data) => {
				if (data) 
					done(data);
				else done();

				expectedFullName = data.fullName;
				expectedCountryISO = data.countryIso;
				expectedLongitude = data.longitude;
				expectedLatitude = data.latitude;
			});
*/

			let invokeGetWeather = (city, callback) => {
				wundergroundAPI.getWeatherConditions('Kyiv', (data) => {
					expectedFullName = data.fullName;
					expectedCountryISO = data.countryIso;
					expectedLongitude = data.longitude;
					expectedLatitude = data.latitude;
				});

				callback(data);
			};

			assert.equal('aasd', expectedFullName);
			assert.equal(0, expectedCountryISO);
			assert.equal(0, expectedLongitude);
			assert.equal(0, expectedLatitude);			
		});
	});
});
			