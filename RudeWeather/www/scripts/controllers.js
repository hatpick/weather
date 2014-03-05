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
		var sunrise_hour = parseInt(sunrise.split(":")[0], 10);
		var sunrise_mins = parseInt(sunrise.split(":")[1], 10);
		var sunriseTime = sunrise_hour*60 + sunrise_mins;
		var sunset = calcSunriseSet(0, geoPoint.coords.latitude, geoPoint.coords.longitude);
		var sunset_hour = parseInt(sunset.split(":")[0], 10);
		var sunset_mins = parseInt(sunset.split(":")[1], 10);
		var sunsetTime = sunset_hour*60 + sunset_mins;
		var noon = calcSolNoon(geoPoint.coords.longitude);
		var noon_hour = parseInt(noon.split(":")[0], 10);
		var noon_mins = parseInt(noon.split(":")[1], 10);
		var noonTime = noon_hour*60 + noon_mins;

		var midnightTime = 24 * 60;


		if(nowTime > sunriseTime && nowTime < noonTime){
			return "morning";
		}
		else if(nowTime >= noonTime && nowTime < sunsetTime){
			return "afternoon";
		}
		else if(nowTime >= sunsetTime && nowTime < midnightTime){
			return "evening";
		}
		else if(nowTime <= sunriseTime){
			return "night";
		}
	}
	$scope.getWeatherCondition = rudeWeatherService.getCondition($scope.geoLocation,
		function(condition){
			$scope.weatherCondition = condition;
			$scope.cityName = condition.name;
			$scope.timeOfDay = $scope.getTimeOfDay();
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