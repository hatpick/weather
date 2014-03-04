var ctrls = angular.module('DatAppRudeWeather.controllers', []);
var REFRESH_DELAY = 100;
ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
}]);

ctrls.controller('WeatherCtrl', ['$scope', '$location', '$rootScope', 'geoPoint', 'rudeWeatherService', function($scope, $location, $rootScope, geoPoint, rudeWeatherService) {
	$scope.geoLocation = geoPoint;
	$scope.sunriseTime =
	$scope.sunsetTime = calcSunriseSet(1, geoPoint.coords.latitude, geoPoint.coords.longitude);
	$scope.cityName;
	$scope.weatherCondition;
	$scope.getTimeOfDay = function() {
		var nowTime_hour = new Date().getHours();
		var nowTime_mins = new Date().getMinutes();
		var nowTime = nowTime_hour*60 + nowTime_mins;
		var sunrise = calcSunriseSet(1, geoPoint.coords.latitude, geoPoint.coords.longitude);
		var sunrise_hour = sunrise.split(":")[0];
		var sunrise_mins = sunrise.split(":")[1];
		var sunriseTime = sunrise_hour*60 + sunrise_mins;
		var sunset = calcSunriseSet(0, geoPoint.coords.latitude, geoPoint.coords.longitude);
		var sunset_hour = sunset.split(":")[0];
		var sunset_mins = sunset.split(":")[1];
		var sunsetTime = sunset_hour*60 + sunset_mins;
		var noon = calcSolNoon(geoPoint.coords.longitude);
		var none_hour = noon.split(":")[0];
		var none_mins = noon.split(":")[1];
		var noneTime = none_hour*60 + none_mins;

		var midnightTime = 24*60;


		if(nowTime > sunriseTime && nowTime < noneTime){
			return "morning";
		}
		else if(nowTime >= noneTime && nowTime < sunsetTime){
			return "afternoon";
		}
		if(nowTime >= sunsetTime && nowTime < midnightTime){
			return "evening";
		}
		if(nowTime <= sunriseTime){
			return "night";
		}
	}
	$scope.getWeatherCondition = rudeWeatherService.getCondition($scope.geoLocation,
		function(condition){
			$scope.weatherCondition = condition;
			$scope.cityName = condition.name;
			console.log($scope.weatherCondition);
		}, function(err) {
			console.log(err);
		}
	);
}]);

ctrls.controller('LoginCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
}]);

ctrls.controller('SettingsCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
}]);