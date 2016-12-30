angular.module('groupProfile').directive('editMemberProfile', [
  
  function () {
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
          scope.data = scope.user;
          scope.show = false;
        }
      }
    }
  }
  
]);