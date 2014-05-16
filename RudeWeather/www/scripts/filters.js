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

filters.filter('iconConvert', [function() {
	return function(summary, timeOfTheDay) {
		var time = (timeOfTheDay == "morning" || timeOfTheDay == "afternoon")? "sun": "moon";

		switch(summary){
			case "clear-day":
				return "sun";
			case "clear-night":
				return "moon";
			case "rain":
				return "rain " + time;
			case "snow":
				return "snow " + time;
			case "sleet":
				return "snow " + time;
			case "wind":
				return "wind " + time;
			case "fog":
				return "fog " + time;
			case "cloudy":
				return "cloud " + time;
			case "partly-cloudy-day":
				return "cloud sun";
			case "partly-cloudy-night":
				return "cloud moon";
			case "hail":
				return "hail " + time;
			case "thunderstorm":
				return "showers cloud " + time;
			case "tornado":
				return "wind cloud " + time;
		}
	}
}]);

