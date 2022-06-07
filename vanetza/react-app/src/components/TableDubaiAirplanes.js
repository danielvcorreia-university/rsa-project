import React from 'react';
import '../App.css';
import AirplaneService from '../services/AirplaneService';

class TableDubaiAirplanes extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            airplanes:[]
        }
    }

    componentDidMount() {
        AirplaneService.get_dubai_airplanes().then((response) => {
            this.setState({ airplanes: response.data })
        });
    }

    handleClick = () => {
        AirplaneService.get_dubai_airplanes().then((response) => {
            this.setState({ airplanes: response.data })
        });
    };

    render() {
        return (

            <div className="table-container">
                <button type="button" className="btn btn-info" onClick={this.handleClick}>Reload Table</button>
                <br></br>
                <h1 className="center"> Airplanes in Dubai </h1>
                <br></br>
                <table className="table table-striped"> 
                    <thead>
                        <tr>

                            <td> Icao </td>
                            <td> País Origem </td>
                            <td> Latitude </td>
                            <td> Longitude </td>
                            <td> Altitude Geográfica</td>
                            <td> Velocidade </td>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.state.airplanes.map(
                                airplane =>
                                <tr key={airplane.icao24}>
                                    <td> {airplane.icao24} </td>
                                    <td> {airplane.origin_country} </td>
                                    <td> {airplane.latitude} </td>
                                    <td> {airplane.longitude} </td>
                                    <td> {airplane.geo_altitude} m </td>
                                    <td> {airplane.velocity} m/s </td>
                                </tr> 
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TableDubaiAirplanes