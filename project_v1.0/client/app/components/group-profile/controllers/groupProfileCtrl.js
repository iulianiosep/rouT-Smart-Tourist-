angular.module('groupProfile').controller('groupProfileCtrl', [
  '$scope',
  '$rootScope',
  '$cookies',
  '$location',
  function (
    $scope,
    $rootScope,
    $cookies,
    $location
  ) {

    'use strict';

    $scope.group = {
      name : $cookies.get('groupName'),
      members:[]
    };
    $scope.isLogged = $cookies.get('isLogged');

    $scope.getInterests = function () {
      
    };
    $scope.pressSignOut = function () {
      $scope.isLogged = false;
      $cookies.remove('isLogged');
      $location.path('/home');
    };

    $scope.addMember = function () {
      $scope.group.members.push({
        placeholder: 'Enter name',
        isNew: true
      })
    };
    $scope.deleteUser = function (user) {
      var i,len;

      for(i=0, len = $scope.group.members.length; i < len; i += 1) {
        if ( angular.equals($scope.group.members[i].name, user.name) ){
          $scope.group.members.splice(i, 1);
          break;
        }
      }
    }
  }
]);