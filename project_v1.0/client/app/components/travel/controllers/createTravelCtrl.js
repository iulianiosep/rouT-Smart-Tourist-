angular.module('travelModule').controller('createTravelCtrl', [
    '$scope',
    '$cookies',
    function (
        $scope,
        $cookies
    ) {
        $scope.saveTravel = function (data) {
            console.log('Cotnriler ', data);
        };

        
    }
]);