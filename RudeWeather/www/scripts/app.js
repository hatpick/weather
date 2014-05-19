'use strict';

$.fn.usedWidth = function() {
    return $(this).width() + parseInt($(this).css("margin-left"), 10) + parseInt($(this).css("margin-right"), 10);
};

$.fn.usedHeight = function() {
    return $(this).height() + parseInt($(this).css("margin-top"), 10) + parseInt($(this).css("margin-bottom"), 10);
};	

var parseBoolean = function(val) {
    return val == "true";
}

var _noty = function(message, type) {
	var options = {
        text : message,
        template : '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        type : type,
        dismissQueue : true,
        layout : 'bottom',
        timeout : 1500,
        closeWith : ['button'],
        buttons : false
    };
    var ntfcn = noty(options);
};

var _deviceInfo = function() {
	var information = {};
	var parser = UAParser();		

	information.device = $.ua.device;
	information.isPhone = ($.ua.device.model != undefined);
	information.browser = $.ua.browser;
	information.os = $.ua.os;

	return information;
}

var app = angular.module('DatAppRudeWeather', ['DatAppRudeWeather.filters', 'DatAppRudeWeather.services', 'DatAppRudeWeather.directives', 'DatAppRudeWeather.controllers', 'ngRoute', 'ngResource'],
    function($routeProvider, $locationProvider) {
    	$routeProvider.when("/", {templateUrl: "views/weather.html", controller: "WeatherCtrl", resolve:
    		{
    			geoInfo: ['$q', 'rudeWeatherService', '$location', function($q, rudeWeatherService, $location){
    				NProgress.start();
                    var deferred = $q.defer();
                    if ("geolocation" in navigator) {
						navigator.geolocation.watchPosition(
							function(geoPoint) {
								var geoInfo = new Object();
								geoInfo.geoPoint = geoPoint;
								rudeWeatherService.getCityName(geoPoint, function(data){
									geoInfo.cityName = data.results[0].formatted_address.split(",")[0];
									deferred.resolve(geoInfo);
								}, function(err){
									deferred.reject;
									console.log("Google is down!");
									NProgress.done();
								});
							}, function(err) {
								console.log(error);
	                        	deferred.reject;
	                        	NProgress.done();
							}
						);
					} else {
						//cordova plugin
					}
                    return deferred.promise;
                }],
                checkUser: ['$q', '$location', function($q, $location){
                	var _user = parseBoolean($.cookie("current"));
                    var deferred = $q.defer();

                    if(_user){
                        deferred.resolve();
                        NProgress.done();
                    }
                    else {
                        deferred.reject();
                        $location.path("/login");
                        NProgress.done();
                    }

                    return deferred.promise;
                }]
    		}
    	});
    	$routeProvider.when("/settings", {templateUrl: "views/settings.html", controller: "SettingsCtrl"});
    	$routeProvider.when("/addComment", {templateUrl: "views/newDesc.html", controller: "AddCommentCtrl"});
    	$routeProvider.when("/login", {templateUrl: "views/login.html", controller: "LoginCtrl", resolve:
            {
                session: ['$q', '$location', function($q, $location){
                    var _user = parseBoolean($.cookie("current"));
                    var deferred = $q.defer();

                    if(_user) {
                        deferred.reject();
                        $location.path("/home");
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }]
            }
        });
    	$routeProvider.otherwise({redirectTo:'/login'});

    	//$locationProvider.html5Mode(true);
});

app.run(['$location', '$rootScope', '$templateCache', 'OpenFB', '$route', '$timeout', function($location, $rootScope, $templateCache, OpenFB, $route, $timeout) {
	OpenFB.init("663966230332774", "https://www.facebook.com/connect/login_success.html", localStorage);

	document.addEventListener("resume", function() {
		$timeout(function(){
			$route.reload();
		});
	}, false);

	$rootScope.$on('$routeChangeStart', function (event, next, current) {					

	});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    });
}]);