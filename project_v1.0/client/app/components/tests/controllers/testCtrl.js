angular.module('testModule').controller('testCtrl', [
  '$scope',
  '$http',
  '$resource',
  function (
    $scope,
    $http,
    $resource
  ) {
    'use strict';

    var findMe = function () {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        zoomLevel: 6
      };

      var transform = function (points) {
        var
          aux = [],
          position,
          result = [];


        result.push(['Lat', 'Lng', 'Name']);

        angular.forEach(points, function (point) {
          position =  point.g.value.split('(')[1].split(',')[0].split(' ');

          aux.push(parseFloat(position[1]));
          aux.push(parseFloat(position[0]));
          aux.push(point.l.value);

          result.push(angular.copy(aux));

          aux = [];
        });

        return result;
      };

      function getSurroundings(spec) {
        var Location = $resource('http://localhost:3000/location/details', {
          lat:'@lat',
          lng:'@lng'
        });

        Location.get(
          {
            lat:spec.options.position.coords.latitude,
            lng:spec.options.position.coords.longitude
          },
          function (data) {
            spec.options.cb(data.data) ;
          },
          function(err) {
            console.log('Error', err);
          });
      }

      function positionSuccess(position) {

        getSurroundings({
          options: {
            position: position,
            cb: callback
          }
        });

        // var lat = position.coords.latitude,
        //     lng = position.coords.longitude,
        //     acr = position.coords.accuracy;
        //
        // console.log('Position', position);

       // var lat = "47.1484439";
       // var lng = 26.1027436;

        function callback(points) {

          points = transform(points);

          google.charts.load("current", {packages: ["map"]});
          google.charts.setOnLoadCallback(drawChart);

          function drawChart() {
            var data = google.visualization.arrayToDataTable(
              points
            );

            var map = new google.visualization.Map(document.getElementById('maps'));
            map.draw(data, {
              howTooltip: true,
              showInfoWindow: true
            });
          }
        }

      }

      function error(err) {
        console.log(err.code, err.message);
      }

      navigator.geolocation.getCurrentPosition(positionSuccess, error, options);



    };


    $scope.findMe = findMe;
  }
]);
