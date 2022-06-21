import React from 'react';
import '../App.css';

class TableCpms extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            currentData: []
        }
        this.ws = new WebSocket("ws://127.0.0.3:8889/");
    }

    render() {
        this.ws.onopen = () => {
            console.log('Opened Connection!')
        };
      
        this.ws.onmessage = (event) => {
            this.setState({ currentData: JSON.parse(event.data) });
            console.log(JSON.parse(event.data))
        };
      
        this.ws.onclose = () => {
            console.log('Closed Connection!')
        };

        return (

            <div className="Table-container">
                <h1 className="center"> CPM Messages </h1>
                <br></br>
                <table className="table table-striped"> 
                    <thead>
                        <tr>

                            <td> Number Of Perceived Objects </td>
                            <td> Object ID </td>
                            <td> Object Confidence </td>
                            
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.state.currentData.map(
                                detection =>
                                detection.fields.cpm.cpmParameters.perceivedObjectContainer.map(
                                    vehicle =>
                                    <tr>
                                        <td> {detection.fields.cpm.cpmParameters.numberOfPerceivedObjects} </td>
                                        <td> {vehicle.objectID} </td>
                                        <td> {vehicle.objectConfidence} </td>
                                    </tr> 
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TableCpms