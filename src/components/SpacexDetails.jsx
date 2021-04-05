import React, { Component } from 'react'
import { Card } from "react-bootstrap";
import './SpacexDetails.css';
const API_BASE_URL = "https://api.spacexdata.com/v3/launches?limit=100";
export default class SpacexDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            data:[],
        }
        
    }
    SpacexMissions = ()=>(
        this.state.data.map(mission=>{
            const {flight_number,mission_name,mission_id,links}=mission
            return <Card className="spacex-details-mission" key={flight_number}>
                       <div className="spacex-details-mission-image">
                           <img 
                                className="spacex-mission-img" 
                                src={links.mission_patch_small} 
                                alt={mission_name}
                           />
                       </div>
            </Card>
        })
    )
    componentDidMount(){
        fetch(API_BASE_URL)
        .then(response => response.json())
        .then(data => this.setState({data:data}))
        .catch(error => console.log(error));
       
    }
    render() {
        console.log(this.state.data);
        return (
            <div className="spacex">
                <div className="spacex-buttons">
                    <label className="switch">
                        SuccessfullLaunch
                        <input type="checkbox"/>
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="spacex-details">
                    <this.SpacexMissions/>
                </div>
            </div>
        )
    }
}
