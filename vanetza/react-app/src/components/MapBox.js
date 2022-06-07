import React from 'react';
import mapboxgl from 'mapbox-gl';
import '../App.css';
import AirplaneService from '../services/AirplaneService';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsdmNvcnJlaWEiLCJhIjoiY2tpa2xodTViMGIyZjJxcGtsNHZkYnU4NCJ9.xk7aj9lSbWNLpvwM_HmdEg';

class MapBox extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        lng: 55.36,
        lat: 25.25,
        zoom: 10
      };
      this.mapContainer = React.createRef();
  }

  async componentDidMount() {
        var data = await AirplaneService.get_dubai_airplanes();
        data = data.data;

        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
          container: this.mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: zoom
        });

        var coordinates = [];
        var currentMarkers = [];
        // on a regular basis, add more coordinates from the saved list and update the map
        var i = 0;
        var timer = window.setInterval(function () {

          // put markers on map
          data.forEach((plane) => {
            var marker = new mapboxgl.Marker()
                                .setLngLat([plane.longitude, plane.latitude])
                                .addTo(map);
            coordinates.push([plane.longitude, plane.latitude]);
          });

          // if (i < coordinates.length) {
          //   // clear prev markers 
          //   if (currentMarkers !== null) {
          //     for (var j = currentMarkers.length - 1; j >= 0; j--) {
          //       currentMarkers[j].remove();
          //     }
          //   }
              
          //   i++;
          // }
        }, 1000);
    }

    render() {
        return (
          <div>
            <div ref={this.mapContainer} className="map-container" />
          </div>
        );
    }
}

export default MapBox