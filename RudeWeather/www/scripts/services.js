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
	rudeWeatherAPI.url = "http://api.weather.com";
	rudeWeatherAPI.actions = {
	};
	rudeWeatherAPI.method = 'POST';

	rudeWeatherAPI.sampleCall = function(data, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.email = email;
		jsonData.password = password;

		var innerAPI = $resource(profitAPI.url,
                         {action: profitAPI.actions["authenticate"]},
                         {
                                get: {
                                    method: 'POST'
                                }
                         });
        return innerAPI.get(jsonData, callbackSuccess, callbackError);
	}

	return rudeWeatherAPI;
}]);
