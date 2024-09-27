angular.module('groupProfile').directive('editMemberProfile', [
  '$resource',
    '$http',
  function (
      $resource,
      $http
  ) {
    'use strict';
    
    return{
      restrict: 'E',
      scope:{
        data:'=',
        show:'='
      },
      templateUrl:'/components/group-profile/templates/editMemberProfileTpl.html',
      link: function (scope) {
        scope.$watch('show', function (newVal, oldVal) {
          if ( newVal ) {
            scope.user = angular.copy(scope.data);
          }
        });
        

        scope.cancelAction = function () {
            scope.show = false;
        };
        scope.saveAction = function () {
           // scope.data = scope.user;
            scope.show = false;

          var urlInterest = 'http://localhost:3000/dydra/api/persons/' + scope.user.name + '/addInterest';
          var urlAddperson = 'http://localhost:3000/dydra/api/persons/addNewPerson';

          function addNewPerson() {
            $http.post(urlAddperson,
                {
                  personName: scope.user.name
                }
            ).then(function (data) {
              console.log('Succes addded persone', data);

              // $http.post(urlInterest,
              //     {
              //       interestName : scope.user.interest
              //     }
              // ).then(function (data) {
              //   console.log('Succes added interest', data);
              // }, function (err) {
              //   console.log('ERR', err)
              // });

            }, function (err) {
              console.log('ERR', err)
            });
          }
          function addNewInterest() {
              $http.post(urlInterest,
                  {
                    interestName : scope.user.interest
                  }
              ).then(function (data) {
                console.log('Succes added interest', data);
              }, function (err) {
                console.log('ERR', err)
              });
          }


          if(scope.data.name !== scope.user.name ){
              addNewPerson();
          }  {
             addNewInterest();
          }



        }


          
      }
    }
  }
  
]);