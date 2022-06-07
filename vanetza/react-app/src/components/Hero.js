import React from 'react';
import AirplaneService from '../services/AirplaneService';

class Hero extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            airplanes: ""
        }
    }

    componentDidMount() {
        AirplaneService.get_most_popular_origin_country().then((response) => {
            this.setState({ airplanes: response.data })
        });
    }

    render() {
        return (
            
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        {
                            <div key={this.state.airplanes}>
                                <h1 className="display-4">{this.state.airplanes} is the most popular origin country! </h1>
                            </div> 
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Hero