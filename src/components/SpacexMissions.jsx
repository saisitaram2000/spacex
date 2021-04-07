import React, { Component } from 'react'
import { Card } from "react-bootstrap";
import Select from 'react-select';
import querystring from 'querystring';
// import ls from 'local-storage'
import 'bootstrap/dist/css/bootstrap.min.css';
import './SpacexMissions.css';
const API_BASE_URL = "https://api.spacexdata.com/v3/launches?limit=100";
const filterLaunchLand =[
    { label: "ALL", value:undefined },
    { label: "TRUE", value: true },
    { label: "FALSE", value: false },
  ];
  const filterYears =[
    { label: "ALL", value:undefined},
    { label: "2021", value:2021},
    { label: "2020", value:2020},
    { label: "2019", value:2019 },
    { label: "2018", value:2018 },
    { label: "2017", value:2017 },
    { label: "2016", value:2016 },
    { label: "2015", value:2015 },
    { label: "2014", value:2014 },
    { label: "2013", value:2013 },
    { label: "2012", value:2012 },
    { label: "2011", value:2011 },
    { label: "2010", value:2010 },
    { label: "2009", value:2009 },
    { label: "2008", value:2008 },
    { label: "2007", value:2007 },
    { label: "2006", value:2006 },
    { label: "2005", value:2005 },
    { label: "2004", value:2004 },
    { label: "2003", value:2003 },
    { label: "2002", value:2002 },
    { label: "2001", value:2001 },
    { label: "2000", value:2000 }

  ];
export default class SpacexDetails extends Component {
    constructor(props) {
        super(props)
        // var path_state = window.history.state;
        // var path="";
        // if(path_state!==null) path=path_state.url;
        // console.log(path.substring(2));
        var query_path = window.location.search;
        const url_parse=querystring.parse(query_path.substring(1), null, null,null);
        
        this.state = {
            data:[],
            filters:{
                "launch_success":url_parse.launch_success,
                "land_success":url_parse.land_success,
                "launch_year":url_parse.launch_year
            },

        }
        // this.handleApplyFilters=this.handleApplyFilters.bind(this);
    }

    fetchApi = API_URL =>{
        fetch(API_URL)
        .then(response => response.json())
        .then(data => {this.setState({data:data})})
        .catch(error => console.log(error));
    }
    changeUrlPath = filters =>{
        
            var activeFilters={};
            if(filters.launch_success!==undefined) activeFilters["launch_success"]=filters.launch_success;
            if(filters.land_success!==undefined) activeFilters["land_success"]=filters.land_success;
            if(filters.launch_year!==undefined) activeFilters["launch_year"]=filters.launch_year;
            var path_url=querystring.stringify(activeFilters);
            if (path_url!=="") path_url="/?"+path_url;
            else path_url="/";
            const obj={
            title:"SpaceX",
            url:path_url
            }
            window.history.replaceState(obj,obj.title,obj.url);
    }
    updatedApiUrl = filters =>{
        var UPDATED_API_URL=API_BASE_URL
        var activeFilters={};
        if(filters.launch_success!==undefined) activeFilters["launch_success"]=filters.launch_success;
        if(filters.land_success!==undefined) activeFilters["land_success"]=filters.land_success;
        if(filters.launch_year!==undefined) activeFilters["launch_year"]=filters.launch_year;
        var path_url=querystring.stringify(activeFilters);
        if (path_url!=="")  UPDATED_API_URL+='&'+path_url;
        console.log(UPDATED_API_URL);
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
        this.state.data.map(mission=>{
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
        })
    )
    render() {
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
                    <this.SpacexMissions/>
                </div>
            </div>
        )
    }
}
