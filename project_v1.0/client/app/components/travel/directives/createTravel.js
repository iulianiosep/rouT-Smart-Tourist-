angular.module('travelModule').directive('createTravel', [

    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: '/components/travel/templates/travelComponent.html',
            scope: {
                save: '&'
            },
            link: function (scope, elem, attr, ctrl) {
                // DRIVING WALKING  BICYCLING TRANSIT
                scope.modeTravel = ["DRIVING", "WALKING",  "BICYCLING", "TRANSIT" ];
                scope.travel = {
                    location:{}
                };
                scope.travel.location.begin  = 'iasi';
                scope.travel.location.end  = 'bucuresti';
                scope.travel.location.step  = 'cluj';
                scope.travel.selectedMode = 'TRANSIT'; // default

                var draw = function (spec) {
                   var  waypts = [];
                    function initMap() {
                        var pointA = new google.maps.LatLng(spec.beginLocation.lat(), spec.beginLocation.lng()),
                            pointB = new google.maps.LatLng(spec.endLocation.lat(), spec.endLocation.lng()),
                            myOptions = {
                                zoom: 14,
                                center: pointA
                            },
                            contentStringPointA,
                            contentStringPointB,
                            infowindowPointA,
                            infowindowPointB,
                            map = new google.maps.Map(document.getElementById('maps'), myOptions),
                            markerA = new google.maps.Marker({
                                position: pointA,
                                title: scope.travel.location.begin,
                                label: 'A',
                                map: map
                            }),
                            markerB = new google.maps.Marker({
                                position: pointB,
                                title:  scope.travel.location.end,
                                label: 'B',
                                map: map
                            }),

                            // Instantiate a directions service.
                            directionsService = new google.maps.DirectionsService,
                            directionsDisplay = new google.maps.DirectionsRenderer({
                                map: map,
                                suppressMarkers: true,
                                preserveViewport: false,
                                polylineOptions: {
                                    strokeColor: '#808080',   // grey'ish
                                    strokeOpacity: 1.0,
                                    strokeWeight: 3
                                }
                            });


                        // messages for points

                        contentStringPointA =  'LOrem ipsum';
                        infowindowPointA = new google.maps.InfoWindow({
                            content: contentStringPointA
                        });
                        markerA.addListener('click', function() {
                            infowindowPointA.open(map, markerA);
                        });

                        contentStringPointB =  'Destination';
                        infowindowPointB = new google.maps.InfoWindow({
                            content: contentStringPointB
                        });
                        markerB.addListener('click', function() {
                            infowindowPointB.open(map, markerB);
                        });

                        // waypts.push({
                        //     location: scope.travel.location.stepObject.place_id,
                        //     stopover: true
                        // });


                        // get route from A to B
                        calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

                    }

                    function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
                        directionsService.route({
                            origin: pointA,
                            destination: pointB,
                            // waypoints: waypts,
                            travelMode: google.maps.TravelMode[scope.travel.selectedMode]
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

                function initMap() {
                    var map = new google.maps.Map(document.getElementById('maps'), {
                        zoom: 16
                        // center: {lat: 44.420000, lng:  26.06000}
                    });
                    var geocoder = new google.maps.Geocoder();

                    geocodeAddress(geocoder, map);
                    // document.getElementById('submit').addEventListener('click', function() {
                    //     geocodeAddress(geocoder, map);
                    // });
                };

                function geocodeAddress  (geocoder, resultsMap) {
                    // var address = document.getElementById('address').value;
                    var begin = scope.travel.location.begin;
                    var end = scope.travel.location.end;
                    var step = scope.travel.location.step;

                    function getInfo(cb) {
                        console.log('getINFO', begin, end);

                        geocoder.geocode({'address': begin}, function(results, status) {
                            if (status === 'OK') {
                                resultsMap.setCenter(results[0].geometry.location);
                                scope.travel.location.beginLocation = results[0].geometry.location;
                                scope.travel.location.beginObj = results[0];
                                // var marker = new google.maps.Marker({
                                //     map: resultsMap,
                                //     position: results[0].geometry.location
                                // });
                                geocoder.geocode({'address': end}, function(results, status) {
                                    if (status === 'OK') {
                                        resultsMap.setCenter(results[0].geometry.location);
                                        scope.travel.location.endLocation = results[0].geometry.location;
                                        scope.travel.location.endObj = results[0];
                                        cb();

                                        // var marker = new google.maps.Marker({
                                        //     map: resultsMap,
                                        //     position: results[0].geometry.location
                                        // });
                                        // geocoder.geocode({'address': step}, function(results, status) {
                                        //     if (status === 'OK') {
                                        //         resultsMap.setCenter(results[0].geometry.location);
                                        //         scope.travel.location.stepLocation = results[0].geometry.location;
                                        //         scope.travel.location.stepObject = results[0];
                                        //
                                        //         cb();
                                        //         // var marker = new google.maps.Marker({
                                        //         //     map: resultsMap,
                                        //         //     position: results[0].geometry.location
                                        //         // });
                                        //     } else {
                                        //         alert('Step location not found: ' + status);
                                        //     }
                                        // })
                                    } else {
                                        alert('Second location not found: ' + status);
                                    }
                                });

                            } else {
                                alert('First location not found: ' + status);
                            }
                        });
                    }
                    getInfo(function () {
                        draw(scope.travel.location);
                    });



                    //
                    // geocoder.geocode({'address': end}, function(results, status) {
                    //     if (status === 'OK') {
                    //         resultsMap.setCenter(results[0].geometry.location);
                    //         scope.travel.location.endLocation = results[0].geometry.location;
                    //
                    //         // var marker = new google.maps.Marker({
                    //         //     map: resultsMap,
                    //         //     position: results[0].geometry.location
                    //         // });
                    //     } else {
                    //         alert('Second location not found: ' + status);
                    //     }
                    // });


                }

                scope.saveTravel = function () {
                    initMap();
                    // scope.save({
                    //     data: scope.travel
                    // });
                }

                scope.$watch('travel.selectedMode', function (oldVal, newVal) {
                    if(oldVal !== newVal){
                        draw(scope.travel.location);
                    }
                })
            }
        }
    }


]);

// AIzaSyByBksBrgrLt1E6ZEmOZJuy5yWQLWfESXg
// AIzaSyBV0TXuEUkziwGEB4hVoZPGiJC1E38aj6w