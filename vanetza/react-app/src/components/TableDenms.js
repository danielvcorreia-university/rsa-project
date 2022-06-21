import React from 'react';
import '../App.css';

class TableDenms extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            currentData: []
        }
        this.ws = new WebSocket("ws://127.0.0.2:8887/");
    }

    render() {
        this.ws.onopen = () => {
            console.log('Opened Connection!')
        };
      
        this.ws.onmessage = (event) => {
            this.setState({ currentData: JSON.parse(event.data) });
        };
      
        this.ws.onclose = () => {
            console.log('Closed Connection!')
        };

        return (

            <div className="Table-container">
                <h1 className="center"> DENM Messages </h1>
                <br></br>
                <table className="table table-striped"> 
                    <thead>
                        <tr>

                            <td> Latitude </td>
                            <td> Longitude </td>
                            <td> Station Type </td>
                            <td> Validity Duration </td>
                            <td> Originating Station ID </td>
                            <td> Cause Code </td>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.state.currentData.map(
                                vehicle =>
                                <tr>
                                    <td> {vehicle.fields.denm.management.eventPosition.latitude} </td>
                                    <td> {vehicle.fields.denm.management.eventPosition.longitude} </td>
                                    <td> {vehicle.fields.denm.management.stationType} </td>
                                    <td> {vehicle.fields.denm.management.validityDuration} s </td>
                                    <td> {vehicle.fields.denm.management.actionID.originatingStationID} </td>
                                    <td> {vehicle.fields.denm.situation.eventType.causeCode} </td>
                                </tr> 
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TableDenms