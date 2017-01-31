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

      // https://maps.googleapis.com/maps/api/directions/json?origin=iasi&destination=bucuresti&key=AIzaSyBV0TXuEUkziwGEB4hVoZPGiJC1E38aj6w
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


      var test = function () {
          function initMap() {
              var pointA = new google.maps.LatLng(51.7519, -1.2578),
                  pointB = new google.maps.LatLng(50.8429, -0.1313),
                  myOptions = {
                      zoom: 7,
                      center: pointA
                  },
                  map = new google.maps.Map(document.getElementById('maps'), myOptions),
                  // Instantiate a directions service.
                  directionsService = new google.maps.DirectionsService,
                  directionsDisplay = new google.maps.DirectionsRenderer({
                      map: map
                  }),
                  markerA = new google.maps.Marker({
                      position: pointA,
                      title: "point A",
                      label: "A",
                      map: map
                  }),
                  markerB = new google.maps.Marker({
                      position: pointB,
                      title: "point B",
                      label: "B",
                      map: map
                  });

              // get route from A to B
              calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

          }

          function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
              directionsService.route({
                  origin: pointA,
                  destination: pointB,
                  travelMode: google.maps.TravelMode.DRIVING
              }, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                      directionsDisplay.setDirections(response);
                  } else {
                      window.alert('Directions request failed due to ' + status);
                  }
              });
          }

          initMap();

      };

      var initMap = function () {
          var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 8,
              center: {lat: -34.397, lng: 150.644}
          });
          var geocoder = new google.maps.Geocoder();

          document.getElementById('submit').addEventListener('click', function() {
              geocodeAddress(geocoder, map);
          });
      };

      var geocodeAddress =  function(geocoder, resultsMap) {
          var address = document.getElementById('address').value;
          geocoder.geocode({'address': address}, function(results, status) {
              if (status === 'OK') {
                  resultsMap.setCenter(results[0].geometry.location);
                  var marker = new google.maps.Marker({
                      map: resultsMap,
                      position: results[0].geometry.location
                  });
              } else {
                  alert('Geocode was not successful for the following reason: ' + status);
              }
          });
      }

      $scope.findMe = test;
  }
]);
