'use strict';


angular.module('routApp', [
  'ngRoute',
  'homepage',
  'groupProfile',
  'testModule',
  'travelModule',

  'ngResource'
])
.config([
  '$locationProvider',
  '$routeProvider',
  function(
    $locationProvider,
    $routeProvider
  ) {


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: false
    });

    $routeProvider
      .when('/home', {
        templateUrl: '/components/homepage/templates/homepageTpl.html',
        controller: 'homepageCtrl'
      })
      .when('/group-profile', {
        templateUrl: '/components/group-profile/templates/groupProfileTpl.html',
        controller: 'groupProfileCtrl'
      })
      .when('/test/', {
          templateUrl: '/components/tests/templates/test.html',
          controller: 'testCtrl'
      })
      .when('/createTravel', {
          templateUrl: '/components/travel/templates/createTravelTpl.html',
          controller: 'createTravelCtrl'
      })
      .otherwise({
        redirectTo: '/home'
      });

}]);
