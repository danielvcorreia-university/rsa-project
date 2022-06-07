import React from 'react';
import mapboxgl from 'mapbox-gl';
import '../App.css';
import AirplaneService from '../services/AirplaneService';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsdmNvcnJlaWEiLCJhIjoiY2tpa2xodTViMGIyZjJxcGtsNHZkYnU4NCJ9.xk7aj9lSbWNLpvwM_HmdEg';

class MapAirplanes extends React.Component {

    constructor(props) {
        super(props);
        this.mapContainer = React.createRef();
        this.state = {
            airplanes:[]
        }
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [55.36, 25.25],
            zoom: 10
        });

        var currentMarkers = [];

        map.on('load', function() {
            AirplaneService.get_dubai_airplanes().then((response) => {
                if (currentMarkers !== null) {
                    for (var i = currentMarkers.length - 1; i >= 0; i--) {
                        currentMarkers[i].remove();
                    }
                }

                response.data.forEach((plane) => {
                    // create a HTML element for each feature
                    var el = document.createElement('div');
                    el.className = 'marker';

                    var marker = new mapboxgl.Marker(el)
                                            .setLngLat([plane.longitude, plane.latitude])
                                            .setPopup(new mapboxgl.Popup( {offset: 30} )
                                            .setHTML('<h4> Plane Info </h4> icao24: ' + plane.icao24 + 
                                                     '<br> País de origem: ' + plane.origin_country +
                                                     '<br> Velocidade: ' + plane.velocity + ' (m/s)'
                                                     ))
                                            .addTo(map);
                    currentMarkers.push(marker);
                });
            });

            window.setInterval(function () {

                AirplaneService.get_dubai_airplanes().then((response) => {
                    if (currentMarkers !== null) {
                        for (var i = currentMarkers.length - 1; i >= 0; i--) {
                            currentMarkers[i].remove();
                        }
                    }

                    response.data.forEach((plane) => {
                        // create a HTML element for each feature
                        var el = document.createElement('div');
                        el.className = 'marker';

                        var marker = new mapboxgl.Marker(el)
                                                .setLngLat([plane.longitude, plane.latitude])
                                                .setPopup(new mapboxgl.Popup( {offset: 30} )
                                                .setHTML('<h4> Plane Info </h4> icao24: ' + plane.icao24 + 
                                                     '<br> País de origem: ' + plane.origin_country +
                                                     '<br> Velocidade: ' + plane.velocity + ' (m/s)'
                                                     ))
                                                .addTo(map);
                        currentMarkers.push(marker);
                    });
                });
            }, 15000);
        });
    }

    render() {
        return (
          <div>
            <div id="map" ref={this.mapContainer} className="map-container" />
          </div>
        );
    }
}

export default MapAirplanes