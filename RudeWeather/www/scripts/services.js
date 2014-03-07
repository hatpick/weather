'use strict';

Parse.initialize("VTb8mtR1ThRJsJSfGN6BAYkHRVKeILbTV3xMeBFN", "izRJBiva0k95YHq5SEVqxMFHM2rVC6SFA1J5ULd4");
window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
      appId      : '663966230332774',
      channelUrl : 'channel.html',
      cookie     : true,
      xfbml      : true
    });
};

(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

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
	rudeWeatherAPI.WeatherConditionCodes = {
		200: {desc: "thunderstorm with light rain", icon: "11d.png", category:"Thunderstorm"},
		201: {desc: "thunderstorm with rain", icon: "11d.png", category:"Thunderstorm"},
		202: {desc: "thunderstorm with heavy rain", icon: "11d.png", category:"Thunderstorm"},
		210: {desc: "light thunderstorm", icon: "11d.png", category:"Thunderstorm"},
		211: {desc: "thunderstorm", icon: "11d.png", category:"Thunderstorm"},
		212: {desc: "heavy thunderstorm", icon: "11d.png", category:"Thunderstorm"},
		221: {desc: "ragged thunderstorm", icon: "11d.png", category:"Thunderstorm"},
		230: {desc: "thunderstorm with light drizzle", icon: "11d.png", category:"Thunderstorm"},
		231: {desc: "thunderstorm with drizzle", icon: "11d.png", category:"Thunderstorm"},
		232: {desc: "thunderstorm with heavy drizzle", icon: "11d.png", category:"Thunderstorm"},
		300: {desc: "light intensity drizzle", icon: "09d.png", category: "Drizzle"},
		301: {desc: "drizzle", icon: "09d.png", category: "Drizzle"},
		302: {desc: "heavy intensity drizzle", icon: "09d.png", category: "Drizzle"},
		310: {desc: "light intensity drizzle rain", icon: "09d.png", category: "Drizzle"},
		311: {desc: "drizzle rain", icon: "09d.png", category: "Drizzle"},
		312: {desc: "heavy intensity drizzle rain", icon: "09d.png", category: "Drizzle"},
		321: {desc: "shower drizzle", icon: "09d.png", category: "Drizzle"},
		500: {desc: "light rain", icon: "10d.png", category: "Rain"},
		501: {desc: "moderate rain", icon: "10d.png", category: "Rain"},
		502: {desc: "heavy intensity rain", icon: "10d.png", category: "Rain"},
		503: {desc: "very heavy rain", icon: "10d.png", category: "Rain"},
		504: {desc: "extreme rain", icon: "10d.png", category: "Rain"},
		511: {desc: "freezing rain", icon: "13d.png", category: "Rain"},
		520: {desc: "light intensity shower rain", icon: "09d.png", category: "Rain"},
		521: {desc: "shower rain", icon: "09d.png", category: "Rain"},
		522: {desc: "heavy intensity shower rain", icon: "09d.png", category: "Rain"},
		600: {desc: "light snow", icon: "13d.png", category: "Snow"},
		601: {desc: "snow", icon: "13d.png", category: "Snow"},
		602: {desc: "heavy snow", icon: "13d.png", category: "Snow"},
		611: {desc: "sleet", icon: "13d.png", category: "Snow"},
		621: {desc: "shower snow", icon: "13d.png", category: "Snow"},
		701: {desc: "mist", icon: "50d.png", category: "Atmosphere"},
		711: {desc: "smoke", icon: "50d.png", category: "Atmosphere"},
		721: {desc: "haze", icon: "50d.png", category: "Atmosphere"},
		731: {desc: "Sand/Dust Whirls", icon: "50d.png", category: "Atmosphere"},
		741: {desc: "Fog", icon: "50d.png", category: "Atmosphere"},
		800: {desc: "sky is clear", icon:"01d.png", category: "Clouds"},
		801: {desc: "few clouds", icon: "02d.png", category: "Clouds"},
		802: {desc: "scattered clouds", icon: "03d.png", category: "Clouds"},
		803: {desc: "broken clouds", icon: "04d.png", category: "Clouds"},
		804: {desc: "overcast clouds", icon: "04d.png", category: "Clouds"},
		900: {desc: "tornado", icon: null, category:"Extreme"},
		901: {desc: "tropical storm", icon: null, category:"Extreme"},
		902: {desc: "hurricane", icon: null, category:"Extreme"},
		903: {desc: "cold", icon: null, category:"Extreme"},
		904: {desc: "hot", icon: null, category:"Extreme"},
		905: {desc: "windy", icon: null, category:"Extreme"},
		906: {desc: "hail", icon: null, category:"Extreme"}
	}

	rudeWeatherAPI.getUnit = function()	{
		return rudeWeatherAPI.unit;
	}

	rudeWeatherAPI.setConditionCache = function(condition)	{
		localStorage.setItem("datapp-condition",JSON.stringify(condition));
	}

	rudeWeatherAPI.getConditionCache = function()	{
		return JSON.parse(localStorage.getItem("datapp-condition"));
	}

	rudeWeatherAPI.setUnit = function(unit)	{
		rudeWeatherAPI.unit = unit;
	}

	rudeWeatherAPI.getCondition = function(geoPoint, callbackSuccess, callbackError) {
		if(rudeWeatherAPI.getConditionCache()){
			callbackSuccess(rudeWeatherAPI.getConditionCache());
			return;
		}
		var innerAPI = $resource(
			rudeWeatherAPI.weatherUrl,
			{latitude:geoPoint.coords.latitude, longitude: geoPoint.coords.longitude, unit: rudeWeatherAPI.unit},
			{
				getWCondition: {method: 'GET'}
			});
		innerAPI.getWCondition(callbackSuccess, callbackError);
	}

	rudeWeatherAPI.addNewRudeComment = function(newRudecomment, callbackSuccess, callbackError) {
		var RudeComment = Parse.Object.extend("RudeComment");
		var rudeComment = new RudeComment();

		rudeComment.set("weatherCode", newRudecomment.weatherCode);
		rudeComment.set("comment", newRudecomment.weatherComment);
		rudeComment.set("description", newRudecomment.weatherDescription);

		rudeComment.save(null, {
			success: function(data){
				callbackSuccess(data);
			},
			error: function(error){
				callbackError(error);
			}
		});
	}

	rudeWeatherAPI.getCodeMeaning = function(code) {
		if(code == -1) return rudeWeatherAPI.WeatherConditionCodes;
		return rudeWeatherAPI.WeatherConditionCodes[code];
	}

	return rudeWeatherAPI;
}]);
