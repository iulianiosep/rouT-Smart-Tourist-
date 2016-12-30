angular.module('homepage').directive('customForm', [
  
  function (
    
  ) {
    'use strict';
    
    return {
      restrict: 'E',
      scope: {
        data: '=',
        showModal : '=',
        closeAction: '&',
        confirmAction: '&'
      },
      templateUrl: "/components/homepage/templates/customFormTpl.html",
      link: function (scope, elem, attrs, ctrl) {
        scope.closeModal = scope.closeAction;

        scope.confirm = function () {
          scope.confirmAction({data: scope.form})
        };

        scope.closeModal = function () {
          scope.closeAction();
        };

        scope.$watch('showModal', function (newVal, oldVal) {
            scope.showForm = newVal;
        });

        scope.$watch('data', function (newVal, oldVal) {
          scope.form = newVal;
        });
      }
    }
  }
]);