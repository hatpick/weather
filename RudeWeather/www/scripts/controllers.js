var ctrls = angular.module('DatAppRudeWeather.controllers', []);
var REFRESH_DELAY = 100;
ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
	$rootScope.currentUser = Parse.User.current();
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
			$scope.weatherDesc = rudeWeatherService.getCodeMeaning(condition.weather[0].id);
			console.log($scope.weatherCondition);
		}, function(err) {
			console.log(err);
		}
	);
}]);

ctrls.controller('AddCommentCtrl', ['$scope', '$location', '$rootScope', 'rudeWeatherService', function($scope, $location, $rootScope, rudeWeatherService) {
	$scope.weatherConditions = rudeWeatherService.getCodeMeaning(-1);
	$scope.addComment = function() {
		if($scope.comment.weatherCode == undefined){
			$(".alert-content").html("Weather Condition Required!");
			$(".alert").addClass("alert-danger").removeClass("hidden");
			return;
		}
		rudeWeatherService.addNewRudeComment($scope.comment, function(data){
			$(".alert-content").html("Success!");
			$(".alert").removeClass().addClass("alert alert-success alert-dismissable");
			console.log(data);
		}, function(){
			$(".alert-content").html("Error!");
			$(".alert").removeClass().addClass("alert alert-danger alert-dismissable");
		})
	}
}]);

ctrls.controller('LoginCtrl', ['$scope', '$location', '$rootScope', '$timeout', function($scope, $location, $rootScope, $timeout) {
	$scope.connectFacebook = function() {
		NProgress.start();
		if (Parse.User.current() == null) {
			Parse.FacebookUtils.logIn("basic_info, email", {
				success: function(user) {
				    FB.api("/me",
				    function (response) {
				      	if (response && !response.error) {
					        user.set("email", response.email);
					        user.set("fName", response.first_name);
					        user.set("lName", response.last_name);
					        user.set("fid", response.id);
					        user.save(null, {
				        		success: function(user){
					        		$rootScope.currentUser = user;
					        		$timeout(function(){
					        			NProgress.done();
					        			$location.path("/");
					        		}, 500);
				        		},
				        		error: function(user, error){
				        			console.log(error);
				        		}
				        	});
				    	}
				    });
				},
				error: function(user, error) {

				}
			});
		}
	}

	$scope.connectTwitter = function() {

	}

	$scope.connectGooglePlus = function() {

	}
}]);

ctrls.controller('SettingsCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
}]);