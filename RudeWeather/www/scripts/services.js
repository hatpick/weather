'use strict';

var services = angular.module('DatAppRudeWeather.services', [])

services.factory('appVersion', function($rootScope){
	var versionMgr = {};
	var version = "1.0";
	
	versionMgr.getVersion = function() {
		return version;
	}

	versionMgr.setVersion = function(version) {
		versionMgr.version = version;
	}

	return versionMgr;
});

services.factory('rudeWeatherService', ['$resource', '$http', function($resource, $http){
	var rudeWeatherAPI = {};
	rudeWeatherAPI.unit = "metric";
	rudeWeatherAPI.weatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=:latitude&lon=:longitude&units=:unit";
	rudeWeatherAPI.dataType = "json";

	Parse.initialize("VTb8mtR1ThRJsJSfGN6BAYkHRVKeILbTV3xMeBFN", "izRJBiva0k95YHq5SEVqxMFHM2rVC6SFA1J5ULd4");

	rudeWeatherAPI.getCondition = function(geoPoint, callbackSuccess, callbackError) {
		var innerAPI = $resource(
			rudeWeatherAPI.weatherUrl,
			{latitude:geoPoint.coords.latitude, longitude: geoPoint.coords.longitude, unit: rudeWeatherAPI.unit},
			{
				getWCondition: {method: 'GET'}
			});
		innerAPI.getWCondition(callbackSuccess, callbackError);
	}

	return rudeWeatherAPI;
}]);
