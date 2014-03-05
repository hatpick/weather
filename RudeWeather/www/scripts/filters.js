'use strict';

var filters = angular.module('DatAppRudeWeather.filters', []);

filters.filter('dbDateConvert', [function() {
	return function(date) {
		return moment(0).seconds(parseInt(date, 10)).format("MM/D/YYYY");
	}
}]);

filters.filter('roundTemperature', ['rudeWeatherService', function(rudeWeatherService) {
	return function(temp) {
		var unit = (rudeWeatherService.getUnit() == "metric")?"\u00B0C": "\u00B0F";
		var convTemp = Math.floor(temp) + unit;
		return convTemp;
	}
}]);
