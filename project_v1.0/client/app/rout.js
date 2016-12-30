'use strict';


angular.module('routApp', [
  'ngRoute',
  'homepage',
  'groupProfile'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
      .when('/', {
        templateUrl: '/components/homepage/templates/homepageTpl.html',
        controller: 'homepageCtrl'
      })
      .when('/group-profile', {
        templateUrl: '/components/group-profile/templates/groupProfileTpl.html',
        controller: 'groupProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

}]);
