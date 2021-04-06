import React, { Component } from 'react'
import { Card } from "react-bootstrap";
import './SpacexMissions.css';
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
            const {flight_number,mission_name,mission_id,links,rocket,launch_year,launch_success}=mission;
            console.log(rocket.first_stage.cores[0].land_success);
            return <Card className="spacex-missions-single" key={flight_number}>
                       <div className="spacex-missions-single-image">
                           <img 
                                className="spacex-missions-img" 
                                src={links.mission_patch_small} 
                                alt={mission_name}
                           />
                       </div>
                       <div className="spacex-missions-single-details">
                           <div className="spacex-mission-name-flight-number">
                               {mission_name} #{flight_number}
                           </div>
                           <div className="spacex-mission-label">
                               Mission ids :
                               <ul>
                                   {
                                       mission_id.map(id=>{
                                          return <li key={id} className="spacex-mission-value">{id}</li>
                                       })
                                   }
                               </ul>
                           </div>
                           <div className="spacex-mission-label">
                               Launch Year :
                               <span className="spacex-mission-value">{launch_year}</span>
                           </div>
                           <div className="spacex-mission-label">
                               Launch Succesfull :
                               <span className="spacex-mission-value">{launch_success}</span>
                           </div>
                           <div className="spacex-mission-label">
                               Land Succesfull :
                               <span className="spacex-mission-value">{rocket.first_stage.cores[0].land_success}</span>
                           </div>
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
                <div className="spacex-missions">
                    <this.SpacexMissions/>
                </div>
            </div>
        )
    }
}
