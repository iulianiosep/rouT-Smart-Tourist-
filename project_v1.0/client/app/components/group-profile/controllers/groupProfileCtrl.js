angular.module('groupProfile').controller('groupProfileCtrl', [
  '$scope',
  '$rootScope',
  function (
    $scope,
    $rootScope
  ) {

    'use strict';

    $rootScope.group = {
      name: 'myGroup',
      members: [
        {
          name: 'user1'
        },
        {
          name: 'user2'
        },
        {
          name: 'user3'
        }
      ]};

    $scope.group = $rootScope.group;

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