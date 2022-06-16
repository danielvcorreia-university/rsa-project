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

            if (currentMarkers !== null) {
                for (var i = currentMarkers.length - 1; i >= 0; i--) {
                    currentMarkers[i].remove();
                }
            }

            vehicles.currentData.forEach((vehicle) => {
                // create a HTML element for each feature
                console.log([vehicle.fields.cam.camParameters.basicContainer.referencePosition.longitude, vehicle.fields.cam.camParameters.basicContainer.referencePosition.latitude])
                var el = document.createElement('div');
                if (vehicle.fields.cam.camParameters.basicContainer.stationType === 5) {
                    el.className = 'Marker-car';
                } else if (vehicle.fields.cam.camParameters.basicContainer.stationType === 6) {
                    el.className = 'Marker-bus';
                }

                var marker = new mapboxgl.Marker(el)
                                        .setLngLat([vehicle.fields.cam.camParameters.basicContainer.referencePosition.longitude, vehicle.fields.cam.camParameters.basicContainer.referencePosition.latitude])
                                        .setPopup(new mapboxgl.Popup( {offset: 30} )
                                        .setHTML('<h4> Vehicle Info </h4> Latitude: ' + vehicle.fields.cam.camParameters.basicContainer.referencePosition.latitude +
                                                 '<br> Longitude: ' + vehicle.fields.cam.camParameters.basicContainer.referencePosition.longitude +
                                                 '<br> Altitude: ' + vehicle.fields.cam.camParameters.basicContainer.referencePosition.altitude.altitudeValue + ' (m)' +
                                                 '<br> Speed: ' + vehicle.fields.cam.camParameters.highFrequencyContainer.basicVehicleContainerHighFrequency.speed.speedValue + ' (m/s)' +
                                                 '<br> Heading: ' + vehicle.fields.cam.camParameters.highFrequencyContainer.basicVehicleContainerHighFrequency.heading.headingValue
                                                 ))
                                        .addTo(map);
                currentMarkers.push(marker);
            });
        });

        window.setInterval(function () {

            if (currentMarkers !== null) {
                for (var i = currentMarkers.length - 1; i >= 0; i--) {
                    currentMarkers[i].remove();
                }
            }
            
            vehicles.currentData.forEach((vehicle) => {
                // create a HTML element for each feature
                console.log([vehicle.fields.cam.camParameters.basicContainer.referencePosition.longitude, vehicle.fields.cam.camParameters.basicContainer.referencePosition.latitude])
                var el = document.createElement('div');
                if (vehicle.fields.cam.camParameters.basicContainer.stationType === 5) {
                    el.className = 'Marker-car';
                } else if (vehicle.fields.cam.camParameters.basicContainer.stationType === 6) {
                    el.className = 'Marker-bus';
                }

                var marker = new mapboxgl.Marker(el)
                                        .setLngLat([vehicle.fields.cam.camParameters.basicContainer.referencePosition.longitude, vehicle.fields.cam.camParameters.basicContainer.referencePosition.latitude])
                                        .setPopup(new mapboxgl.Popup( {offset: 30} )
                                        .setHTML('<h4> Vehicle Info </h4> Latitude: ' + vehicle.fields.cam.camParameters.basicContainer.referencePosition.latitude +
                                                 '<br> Longitude: ' + vehicle.fields.cam.camParameters.basicContainer.referencePosition.longitude +
                                                 '<br> Altitude: ' + vehicle.fields.cam.camParameters.basicContainer.referencePosition.altitude.altitudeValue + ' (m)' +
                                                 '<br> Speed: ' + vehicle.fields.cam.camParameters.highFrequencyContainer.basicVehicleContainerHighFrequency.speed.speedValue + ' (m/s)' +
                                                 '<br> Heading: ' + vehicle.fields.cam.camParameters.highFrequencyContainer.basicVehicleContainerHighFrequency.heading.headingValue
                                                 ))
                                        .addTo(map);
                currentMarkers.push(marker);
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
