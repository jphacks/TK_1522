'use strict';

/**
 * @ngdoc overview
 * @name skywayApp
 * @description
 * # skywayApp
 *
 * Main module of the application.
 */
var app = angular
  .module('skywayApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  app.run (["$rootScope", "$http", function ($rootScope, $http) {
    var peer = new Peer({ key: '46eae595-3231-436c-adff-c80d984deb84', debug: 3});

    peer.on('open', function(){
      console.log("connected to")
      console.log(peer.id);
    });


    SpeechRec.config({
      'SkyWayKey':'46eae595-3231-436c-adff-c80d984deb84',
      'OpusWorkerUrl': 'scripts/js/libopus.worker.js' 
    });

    

  }])
