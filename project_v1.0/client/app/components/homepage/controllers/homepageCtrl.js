angular.module('homepage').controller('homepageCtrl', [
  '$scope',
  '$location',
  '$rootScope',
  function (
    $scope,
    $location,
    $rootScope
  ) {
    'use strict';

    //$location.path('/group-profile');

    $scope.close = function () {
      $scope.showpopup = false;
    };

    $scope.confirm = function (data) {
      $scope.showpopup = false;

      $rootScope.group = {
        name: 'GROUP NAME',
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
        ]

      };

      $location.path('/group-profile');
    };

    $scope.pressSignup = function () {
      $scope.data =  {
        title :'Sign up',
        confirmLabel: 'Create account',
        fields : [
          {
            label: 'Group name',
            type:'text',
            placeholder: 'Enter group name'
          },
          {
            label: 'Password',
            type:'password',
            placeholder: 'Enter password'
          },
          {
            label: 'Confirm password',
            type:'password',
            placeholder: 'Enter same password'
          }
        ]
      };
      $scope.showpopup = true;
    };

    $scope.pressSignin = function () {
      $scope.data =  {
        title :'Sign in',
        confirmLabel: 'Login',
        fields : [
          {
            label: 'Group name',
            type:'text',
            placeholder: 'Enter group name'
          },
          {
            label: 'Password',
            type:'password',
            placeholder: 'Enter password'
          }
        ]
      };
      $scope.showpopup = true;
    };
  }
]);