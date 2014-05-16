'use strict';

Parse.initialize("VTb8mtR1ThRJsJSfGN6BAYkHRVKeILbTV3xMeBFN", "izRJBiva0k95YHq5SEVqxMFHM2rVC6SFA1J5ULd4");
// window.fbAsyncInit = function() {
//     Parse.FacebookUtils.init({
//       appId      : '663966230332774',
//       channelUrl : 'channel.html',
//       cookie     : true,
//       xfbml      : true
//     });
// };

// (function(d){
//     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement('script'); js.id = id; js.async = true;
//     js.src = "//connect.facebook.net/en_US/all.js";
//     ref.parentNode.insertBefore(js, ref);
// }(document));

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

services.factory('OpenFB', ['$rootScope', '$q', '$window', '$http', function ($rootScope, $q, $window, $http) {

        var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth',

        // By default we store fbtoken in sessionStorage. This can be overriden in init()
            tokenStore = window.sessionStorage,

            fbAppId,
            oauthRedirectURL,

        // Because the OAuth login spans multiple processes, we need to keep the success/error handlers as variables
        // inside the module instead of keeping them local within the login function.
            deferredLogin,

        // Indicates if the app is running inside Cordova
            runningInCordova,

        // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
            loginProcessed;

        document.addEventListener("deviceready", function () {
            runningInCordova = true;
        }, false);

        /**
         * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
         * use any other function.
         * @param appId - The id of the Facebook app
         * @param redirectURL - The OAuth redirect URL. Optional. If not provided, we use sensible defaults.
         * @param store - The store used to save the Facebook token. Optional. If not provided, we use sessionStorage.
         */
        function init(appId, redirectURL, store) {
            fbAppId = appId;
            if (redirectURL) oauthRedirectURL = redirectURL;
            if (store) tokenStore = store;
        }

        /**
         * Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
         * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
         * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
         * @param fbScope - The set of Facebook permissions requested
         */
        function login(fbScope) {

            if (!fbAppId) {
                return error({error: 'Facebook App Id not set.'});
            }

            var loginWindow;

            fbScope = fbScope || '';

            deferredLogin = $q.defer();

            loginProcessed = false;

            logout();

            // Check if an explicit oauthRedirectURL has been provided in init(). If not, infer the appropriate value
            if (!oauthRedirectURL) {
                if (runningInCordova) {
                    oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
                } else {
                    // Trying to calculate oauthRedirectURL based on the current URL.
                    var index = document.location.href.indexOf('index.html');
                    if (index > 0) {
                        oauthRedirectURL = document.location.href.substring(0, index) + 'oauthcallback.html';
                    } else {
                        return alert("Can't reliably infer the OAuth redirect URI. Please specify it explicitly in openFB.init()");
                    }
                }
            }

            loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + fbAppId + '&redirect_uri=' + oauthRedirectURL +
                '&response_type=token&display=popup&scope=' + fbScope, '_blank', 'location=no');

            // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
            if (runningInCordova) {
                loginWindow.addEventListener('loadstart', function (event) {
                    var url = event.url;
                    if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                        loginWindow.close();
                        oauthCallback(url);
                    }
                });

                loginWindow.addEventListener('exit', function () {
                    // Handle the situation where the user closes the login window manually before completing the login process
                    deferredLogin.reject({error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled"});
                });
            }
            // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
            // oauthCallback() function. See oauthcallback.html for details.

            return deferredLogin.promise;

        }

        /**
         * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
         * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
         * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
         * OAuth workflow.
         */
        function oauthCallback(url) {
            // Parse the OAuth data received from Facebook
            console.log(url);
            var queryString,
                obj;

            loginProcessed = true;
            if (url.indexOf("access_token=") > 0) {
                queryString = url.substr(url.indexOf('#') + 1);
                obj = parseQueryString(queryString);
                tokenStore['fbtoken'] = obj['access_token'];
                tokenStore['expiresin'] = obj['expires_in'];
                deferredLogin.resolve();
            } else if (url.indexOf("error=") > 0) {
                queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
                obj = parseQueryString(queryString);
                deferredLogin.reject(obj);
            } else {
                deferredLogin.reject();
            }
        }

        /**
         * Application-level logout: we simply discard the token.
         */
        function logout() {
            tokenStore['fbtoken'] = undefined;
        }

        /**
         * Helper function to de-authorize the app
         * @param success
         * @param error
         * @returns {*}
         */
        function revokePermissions() {
            return api({method: 'DELETE', path: '/me/permissions'})
                .success(function () {
                    console.log('Permissions revoked');
                });
        }

        /**
         * Lets you make any Facebook Graph API request.
         * @param obj - Request configuration object. Can include:
         *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
         *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
         *  params:  queryString parameters as a map - Optional
         */
        function api(obj) {

            var method = obj.method || 'GET',
                params = obj.params || {};

            params['access_token'] = tokenStore['fbtoken'];

            return $http({method: method, url: 'https://graph.facebook.com' + obj.path, params: params})
                .error(function(data, status, headers, config) {
                    if (data.error && data.error.type === 'OAuthException') {
                        $rootScope.$emit('OAuthException');
                    }
                });
        }

        /**
         * Helper function for a POST call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function post(path, params) {
            return api({method: 'POST', path: path, params: params});
        }

        /**
         * Helper function for a GET call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function get(path, params) {
            return api({method: 'GET', path: path, params: params});
        }

        function parseQueryString(queryString) {
            var qs = decodeURIComponent(queryString),
                obj = {},
                params = qs.split('&');
            params.forEach(function (param) {
                var splitter = param.split('=');
                obj[splitter[0]] = splitter[1];
            });
            return obj;
        }

        return {
            init: init,
            login: login,
            logout: logout,
            revokePermissions: revokePermissions,
            api: api,
            post: post,
            get: get,
            oauthCallback: oauthCallback
        }

    }]);

services.factory('rudeWeatherService', ['$resource', '$http', function($resource, $http){
	var rudeWeatherAPI = {};
	rudeWeatherAPI.unit = "metric";
	rudeWeatherAPI.apiKey = "8867c87ea53007f46020c81920731729";
	rudeWeatherAPI.geoKey = "AIzaSyBVvZ0anzSeuC3xVNlj_YnPUnYFzEfzx-Y";
	rudeWeatherAPI.weatherUrl = "https://api.forecast.io/forecast/:key/:latitude,:longitude?units=si";
	rudeWeatherAPI.geoCodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=:latitude,:longitude&sensor=true&key=:key&result_type=locality"
	rudeWeatherAPI.dataType = "json";
	rudeWeatherAPI.WeatherConditionCodes = {
		"clear-day": "clear-day",
		"clear-night": "clear-night",
		"rain": "rain",
		"snow": "snow",
		"sleet": "sleet",
		"wind": "wind",
		"fog": "fog",
		"cloudy": "cloudy",
		"partly-cloudy-day": "partly-cloudy-day",
		"partly-cloudy-night": "partly-cloudy-night",
		"hail": "hail",
		"thunderstorm": "thunderstorm",
		"tornado":"tornado"
	}

	rudeWeatherAPI.getUnit = function()	{
		return rudeWeatherAPI.unit;
	}

	rudeWeatherAPI.setUnit = function(unit)	{
		rudeWeatherAPI.unit = unit;
	}

	rudeWeatherAPI.getCondition = function(geoPoint, callbackSuccess, callbackError) {
		var innerAPI = $resource(
			rudeWeatherAPI.weatherUrl,
			{key: rudeWeatherAPI.apiKey, latitude:geoPoint.coords.latitude, longitude: geoPoint.coords.longitude, callback: "JSON_CALLBACK"},
			{
				getWCondition: {method: 'JSONP'}
			});
		innerAPI.getWCondition(callbackSuccess, callbackError);
	}

	rudeWeatherAPI.getRudeStuff = function(code, callbackSuccess, callbackError) {
		var RudeComment = Parse.Object.extend("RudeComment");
		var query = new Parse.Query(RudeComment);
		query.equalTo("weatherCode", code);
		query.find({
			success: function(results){
				var rand = Math.floor((Math.random()*3817) % results.length);
				callbackSuccess(results[rand]);
			},
			error: function(error){
				callbackError(error);
			}
		});
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

	rudeWeatherAPI.getCityName = function(geoPoint, callbackSuccess, callbackError) {
		var innerAPI = $resource(
			rudeWeatherAPI.geoCodingUrl,
			{key: rudeWeatherAPI.geoKey, latitude:geoPoint.coords.latitude, longitude: geoPoint.coords.longitude},
			{
				doReverse: {method: 'GET'}
			});
		innerAPI.doReverse(callbackSuccess, callbackError);
	}

	rudeWeatherAPI.getCodeMeaning = function(code) {
		if(code == -1) return rudeWeatherAPI.WeatherConditionCodes;
		return rudeWeatherAPI.WeatherConditionCodes[code];
	}

	return rudeWeatherAPI;
}]);
