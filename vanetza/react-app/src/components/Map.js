import React from 'react';
import mapboxgl from 'mapbox-gl';
import '../App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsdmNvcnJlaWEiLCJhIjoiY2tpa2xodTViMGIyZjJxcGtsNHZkYnU4NCJ9.xk7aj9lSbWNLpvwM_HmdEg';

var vehicles = [];

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.mapContainer = React.createRef();
        this.state = {
            currentData: []
        };
        this.ws = new WebSocket("ws://127.0.0.1:8888/");
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-8.6632728, 40.6041953],
            zoom: 15
        });

        var currentMarkers = [];

        map.on('load', function() {
            vehicles.currentData.forEach((vehicle) => {
                // create a HTML element for each feature
                var el = document.createElement('div');
                if (vehicle.stationType === 5) {
                    el.className = 'Marker-car';
                } else if (vehicle.stationType === 6) {
                    el.className = 'Marker-bus';
                }

                var marker = new mapboxgl.Marker(el)
                                        .setLngLat([vehicle.longitude, vehicle.latitude])
                                        .setPopup(new mapboxgl.Popup( {offset: 30} )
                                        .setHTML('<h4> Vehicle Info </h4> Latitude: ' + vehicle.latitude +
                                                 '<br> Longitude: ' + vehicle.longitude +
                                                 '<br> Altitude: ' + vehicle.altitude + ' (m)' +
                                                 '<br> Speed: ' + vehicle.speed + ' (m/s)' +
                                                 '<br> Heading: ' + vehicle.heading
                                                 ))
                                        .addTo(map);
                currentMarkers.push(marker);
            });
        });

        window.setInterval(function () {
            let i = 0;

            vehicles.currentData.forEach((vehicle) => {
                currentMarkers[i].setLngLat([vehicle.longitude, vehicle.latitude]);
                currentMarkers[i].setHTML('<h4> Vehicle Info </h4> Latitude: ' + vehicle.latitude +
                '<br> Longitude: ' + vehicle.longitude +
                '<br> Altitude: ' + vehicle.altitude + ' (m)' +
                '<br> Speed: ' + vehicle.speed + ' (m/s)' +
                '<br> Heading: ' + vehicle.heading
                );

                i += 1;
            });
        }, 1000);
    }

    render() {
        this.ws.onopen = () => {
            console.log('Opened Connection!')
        };
      
        this.ws.onmessage = (event) => {
            this.setState({ currentData: JSON.parse(event.data) });
            vehicles = { currentData: JSON.parse(event.data) };
        };
      
        this.ws.onclose = () => {
            console.log('Closed Connection!')
        };

        return (
          <div>
            <div id="map" ref={this.mapContainer} className="Map-container" />
          </div>
        );
    }
}

export default Map
