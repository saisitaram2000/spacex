import React, { Component } from 'react'
import { Card } from "react-bootstrap";
import Select from 'react-select';
import querystring from 'querystring';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SpacexMissions.css';
const API_BASE_URL = "https://api.spacexdata.com/v3/launches?limit=100";
const filterLaunchLand =[
    { label: "ALL", value:undefined },
    { label: "TRUE", value: true },
    { label: "FALSE", value: false },
  ];
var filterYears = [{ label: "ALL", value:undefined}];
for(let year=new Date().getFullYear();year>2005;year--){
    filterYears.push({ label:`${year}`, value:year});
}
export default class SpacexDetails extends Component {
    constructor(props) {
        super(props)
        var query_path = window.location.search;
        const url_parse=querystring.parse(query_path.substring(1), null, null,null);
        this.state = {
            data:[],
            filters:{
                "launch_success":url_parse.launch_success,
                "land_success":url_parse.land_success,
                "launch_year":url_parse.launch_year
            },
            isLoading:true
        }
        // this.handleApplyFilters=this.handleApplyFilters.bind(this);
    }

    fetchApi = API_URL =>{
        fetch(API_URL)
        .then(response => response.json())
        .then(data => {this.setState({data:data,isLoading:false})})
        .catch(error => console.log(error));
    }
    addActiveFilterToUrl = filters =>{
        var activeFilters={};
        if(filters.launch_success!==undefined) activeFilters["launch_success"]=filters.launch_success;
        if(filters.land_success!==undefined) activeFilters["land_success"]=filters.land_success;
        if(filters.launch_year!==undefined) activeFilters["launch_year"]=filters.launch_year;
        var path_url=querystring.stringify(activeFilters);
        return path_url
    }
    changeUrlPath = filters =>{
            var path_url=this.addActiveFilterToUrl(filters);
            if (path_url!==""){
                path_url="/?"+path_url;
            }else{
                path_url="/";
            } 
            const obj={
            title:"SpaceX",
            url:path_url
            }
            window.history.replaceState(obj,obj.title,obj.url);
    }
    updatedApiUrl = filters =>{
        var UPDATED_API_URL=API_BASE_URL
        var path_url=this.addActiveFilterToUrl(filters);
        if (path_url!=="")  UPDATED_API_URL+='&'+path_url;
        return UPDATED_API_URL;
    }
    addFiltersToApiUrl = filters =>{
        var UPDATED_API_URL=this.updatedApiUrl(filters);
        this.changeUrlPath(filters);
        this.fetchApi(UPDATED_API_URL);
    }
    handleApplyFilters = (value,name) =>{
        const filters = { ...this.state.filters, [name]: value }
        this.setState(() => ({ filters }))
        this.addFiltersToApiUrl(filters);
    }
    componentDidMount(){
        var qs= window.location.search;
        if(qs===""){
            this.fetchApi(API_BASE_URL);
        }else{
            const url_parse=querystring.parse(qs.substring(1), null, null,null);
            var UPDATED_API_URL =this.updatedApiUrl(url_parse);
            this.fetchApi(UPDATED_API_URL);
            
        }
   
    }
    getDefaultLaunchLandValue = val =>{
        if(val===undefined){
            return {label:"ALL",value:undefined};
        }
        return {label:val==="true"?"TRUE":"FALSE",value:val==="true"};
    }
    getDefaultLaunchYear = year =>{
        if(year===undefined){
            return {label:"ALL",value:undefined};
        }
        return {label:year,value:parseInt(year)};
    }
    SpacexMissions = ()=>(
        this.state.data.length!==0?this.state.data.map(mission=>{
            const {flight_number,mission_name,mission_id,links,rocket,launch_year,launch_success}=mission;
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
                            {mission_id.length!==0 && <div className="spacex-mission-label-value">
                                <div className="spacex-mission-label">Mission ids</div>
                               <div className="spacex-mission-value">
                                   {
                                       mission_id.map(id=>{
                                          return <div key={id} className="spacex-mission-value"><b>:&nbsp;&nbsp;&nbsp;</b>{id}</div>
                                       })
                                   }
                               </div>
                           </div>}
                           <div className="spacex-mission-label-value">
                           <div className="spacex-mission-label"> Launch Year</div>
                               <span className="spacex-mission-value"><b>:&nbsp;&nbsp;&nbsp;</b>{launch_year}</span>
                           </div>
                           <div className="spacex-mission-label-value">
                           <div className="spacex-mission-label"> Launch Success</div>
                               <span className="spacex-mission-value">
                               <b>:&nbsp;&nbsp;&nbsp;</b>{launch_success ? "True" : "False"}
                               </span>
                           </div>
                           <div className="spacex-mission-label-value">
                           <div className="spacex-mission-label"> Land Success</div>
                               <span className="spacex-mission-value">
                                    <b>:&nbsp;&nbsp;&nbsp;</b>{rocket.first_stage.cores[0].land_success? "True":"False"}
                               </span>
                           </div>
                       </div>
            </Card>
        }):<div className="spacex-missions-single-no-data">
                <img className="spacex-missions-no-data-img"  src="./nodata.jpg" alt="nodata"></img>
            </div>
    )
    render() {
        const {isLoading}=this.state;
        return (
            <div className="spacex">
                <div className="spacex-buttons">
                    <div className="spacex-buttons-label">
                        <div className="spacex-buttons-label-name">LaunchSuccess</div>
                        <Select 
                            className="spacex-dropdown" 
                            placeholder="Launch Success"
                            defaultValue={this.getDefaultLaunchLandValue(this.state.filters.launch_success)}
                            options={filterLaunchLand} 
                            onChange= {
                                (e)=>this.handleApplyFilters(e.value,"launch_success")
                            }
                        />
                    </div>
                    <div className="spacex-buttons-label">
                        <div className="spacex-buttons-label-name">LandSuccess</div>
                        <Select 
                            className="spacex-dropdown" 
                            placeholder="Land Success"
                            defaultValue={this.getDefaultLaunchLandValue(this.state.filters.land_success)}
                            options={filterLaunchLand}
                            onChange= {
                               (e)=> this.handleApplyFilters(e.value,"land_success")
                            } 
                        />
                    </div>
                    <div className="spacex-buttons-label">
                        <div className="spacex-buttons-label-name">LaunchYear</div>
                        <Select 
                            className="spacex-dropdown" 
                            placeholder="Launch Year"
                            defaultValue={this.getDefaultLaunchYear(this.state.filters.launch_year)}
                            options={filterYears}  
                            onChange= {
                               (e)=> this.handleApplyFilters(e.value,"launch_year")
                            }
                        />
                    </div>
                </div>
                <div className="spacex-missions">   
                    {isLoading?<div><img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading"/></div>:<this.SpacexMissions/>}
                </div>
            </div>
        )
    }
}
