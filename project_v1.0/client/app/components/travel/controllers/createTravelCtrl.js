angular.module('travelModule').controller('createTravelCtrl', [
    '$scope',

    function ($scope) {
        $scope.saveTravel = function (data) {
            console.log('Cotnriler ', data);
        }
    }
]);