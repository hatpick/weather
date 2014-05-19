var ctrls = angular.module('DatAppRudeWeather.controllers', []);
var REFRESH_DELAY = 100;
ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
	$rootScope.currentUser = Parse.User.current();
}]);

ctrls.controller('WeatherCtrl', ['$scope', '$location', '$rootScope', 'geoInfo', 'rudeWeatherService', 'OpenFB', '$timeout', function($scope, $location, $rootScope, geoInfo, rudeWeatherService, OpenFB, $timeout) {
	$scope.geoLocation = geoInfo.geoPoint;
	$scope.cityName = geoInfo.cityName;
	$scope.sunsetTime = calcSunriseSet(1, geoInfo.geoPoint.coords.latitude, geoInfo.geoPoint.coords.longitude);
	$scope.weatherCondition;
	$scope.getTimeOfDay = function() {
		var nowTime_hour = new Date().getHours();
		var nowTime_mins = new Date().getMinutes();
		var nowTime = nowTime_hour*60 + nowTime_mins;
		var sunrise = calcSunriseSet(1, geoInfo.geoPoint.coords.latitude, geoInfo.geoPoint.coords.longitude);
		var sunrise_hour = parseInt(sunrise.split(":")[0], 10);
		var sunrise_mins = parseInt(sunrise.split(":")[1], 10);
		var sunriseTime = sunrise_hour*60 + sunrise_mins;
		var sunset = calcSunriseSet(0, geoInfo.geoPoint.coords.latitude, geoInfo.geoPoint.coords.longitude);
		var sunset_hour = parseInt(sunset.split(":")[0], 10);
		var sunset_mins = parseInt(sunset.split(":")[1], 10);
		var sunsetTime = sunset_hour*60 + sunset_mins;
		var noon = calcSolNoon(geoInfo.geoPoint.coords.longitude);
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
			$scope.temperature = condition.currently.temperature;
			$scope.weatherIconName = condition.currently.icon;
			$scope.timeOfDay = $scope.getTimeOfDay();
			$scope.weatherDesc = condition.currently.summary;

			rudeWeatherService.getRudeStuff($scope.weatherIconName, function(rudeStuff){
				$scope.$apply(function(){
					$scope.rudeStuff = rudeStuff;
					NProgress.done();
				});
			}, function(err){
				console.log(err);
				NProgress.done();
			})
		}, function(err) {
			console.log(err);
			NProgress.done();
		}
	);

	$scope.captureScreen = function() {
		$(".share-facebook").hide("fast", function(){
			navigator.screenshot.save(function(error,res){
				if(error){
			    	console.error(error);
			  	} else{
			  		var file = new Parse.File(res.filePath.split("/")[res.filePath.split("/").length - 1], {base64: res.based64Content}, "image/png");
			  		file.save().then(function() {
			  			var SharedRudes = Parse.Object.extend("SharedRudes");
			  			var sr = new SharedRudes();
			  			sr.set("screenshot", file);
			  			sr.setACL(new Parse.ACL(Parse.User.current()));
			  			sr.save(null, {
			  				success: function(data){
				  				//Share on facebook
								OpenFB.post("/me/photos", {
									url: data.get("screenshot")._url,
									message: "Current Weather in " + $scope.cityName + ", brought to you by RudeWeather!",
									privacy:
										{value: "ALL_FRIENDS"}
									});
								$(".share-facebook").show("slow", function(){
									_noty("Shared on facebook!", "success");
								});
			  				},
			  				error: function(error){
			  					console.log("error");
			  				}
			  			});
					}, function(error) {
						console.log(error)
					});
			  	}
			},'png',100);
		});
	}
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
			$("#RudeComment").val("");
			$("#RudeDescription").val("");
			$("#WeatherCondition")[0].selectedIndex = -1;
			console.log(data);
		}, function(){
			$(".alert-content").html("Error!");
			$(".alert").removeClass().addClass("alert alert-danger alert-dismissable");
		})
	}
}]);

ctrls.controller('LoginCtrl', ['$scope', '$location', '$rootScope', '$timeout', 'OpenFB', function($scope, $location, $rootScope, $timeout, OpenFB) {
	$scope.connectFacebook = function() {
		NProgress.start();
		if (Parse.User.current() == null) {
			OpenFB.login('email, publish_stream').then(
                function () {
			        OpenFB.get('/me').success(function (user) {
			        	var fbToken = localStorage.fbtoken;
			        	var expiresIn = localStorage.expiresin;

			        	var expDate = new Date(new Date().getTime() + parseInt(expiresIn, 10) * 1000).toISOString();
				        var authData = {
			                id: user.id,
			                access_token: fbToken,
			                expiration_date: expDate
				        }

				        Parse.FacebookUtils.logIn(authData).then(function(puser){
				        	puser.set("email", user.email);
					        puser.set("fName", user.first_name);
					        puser.set("lName", user.last_name);
					        puser.set("fid", user.id);
					        puser.save(null, {
				        		success: function(ppuser){
					        		$rootScope.currentUser = ppuser;
					        		$.cookie("current", true, { expires: 14});
					        		$timeout(function(){
					        			NProgress.done();
					        			$location.path("/");
					        		}, 500);
				        		},
				        		error: function(ppuser, error){
				        			$.cookie("current", false, { expires: 14});
				        			console.log(error);
				        		}
				        	});
				        }, function(error){
				        	$.cookie("current", false, { expires: 14});
				        	console.log(error);
				        });
			        });
                },
                function () {
                    alert('OpenFB login failed');
                    $.cookie("current", false, { expires: 14});
                });
		}
		else {
			$rootScope.currentUser = ppuser;
    		$.cookie("current", true, { expires: 14});
    		$timeout(function(){
    			NProgress.done();
    			$location.path("/");
    		}, 500);
		}
	}

	$scope.connectTwitter = function() {

	}

	$scope.connectGooglePlus = function() {

	}
}]);

ctrls.controller('SettingsCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
}]);