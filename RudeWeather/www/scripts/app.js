'use strict';

$.fn.usedWidth = function() {
    return $(this).width() + parseInt($(this).css("margin-left"), 10) + parseInt($(this).css("margin-right"), 10);
};

$.fn.usedHeight = function() {
    return $(this).height() + parseInt($(this).css("margin-top"), 10) + parseInt($(this).css("margin-bottom"), 10);
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
    			geoPoint: ['$q', '$location', function($q, profitAppService, $location){
    				NProgress.start();
                    var deferred = $q.defer();
                    if ("geolocation" in navigator) {
						navigator.geolocation.watchPosition(
							function(geoPoint) {
								deferred.resolve(geoPoint);
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
                }]
    		}
    	});
    	$routeProvider.when("/settings", {templateUrl: "views/settings.html", controller: "SettingsCtrl"});
    	$routeProvider.when("/addComment", {templateUrl: "views/newDesc.html", controller: "AddCommentCtrl"});
    	$routeProvider.when("/login", {templateUrl: "views/login.html", controller: "LoginCtrl"});
    	$routeProvider.otherwise({redirectTo:'/login'});

    	//$locationProvider.html5Mode(true);
});

app.run(['$location', '$rootScope', '$templateCache', function($location, $rootScope, $templateCache) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {					

	});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    });
}]);