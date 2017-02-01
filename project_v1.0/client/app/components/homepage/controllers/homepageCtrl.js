angular.module('homepage').controller('homepageCtrl', [
  '$scope',
  '$location',
  '$rootScope',
    '$cookies',
    '$resource',
    '$http',
  function (
    $scope,
    $location,
    $rootScope,
    $cookies,
    $resource,
    $http
  ) {
    'use strict';

    //$location.path('/group-profile');


    $scope.isLogged = false;
    $scope.close = function () {
      $scope.showpopup = false;
    };

    $scope.confirm = function (data) {
      $scope.showpopup = false;
      $scope.isLogged = true;
      $cookies.put('isLogged', true);
      $cookies.put('groupName', data.fields[0].value );

      $http.post('http://localhost:3000/dydra/api/groups/addNewGroup',
          {
            groupName: data.fields[0].value
          }
          ).then(function (data) {
            console.log('SUCCEs', data);
          }, function (err) {
            console.log('ERR', err)
          });

    //   var group = $resource('http://localhost:3000/dydra/api/groups/addNewGroup', {
    //     groupName:'@groupN'
    //   });
    //
    //   group.post(
    //       {
    //         groupN:data.fields[0].value
    //       },
    //       function (data) {
    //         console.log('SAVEEEEE');
    //         // spec.options.cb(data.data) ;
    //       },
    //       function(err) {
    //         console.log('Error', err);
    //       });
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

    $scope.pressSignOut = function () {
      $scope.isLogged = false;
      $cookies.remove('isLogged');
    };


  }
]);