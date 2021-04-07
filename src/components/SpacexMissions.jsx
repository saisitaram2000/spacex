import React, { Component } from 'react'
import { Card } from "react-bootstrap";
import Select from 'react-select';
import querystring from 'querystring';
import ls from 'local-storage'
import 'bootstrap/dist/css/bootstrap.min.css';
import './SpacexMissions.css';
const API_BASE_URL = "https://api.spacexdata.com/v3/launches?limit=100";
const filterLaunchLand =[
    { label: "ALL", value: undefined },
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
        var path_state = window.history.state;
        var path="";
        if(path_state!==null) path=path_state.url;
        console.log(path);
        const url_parse=querystring.parse(path, null, null,
            null);
        console.log(url_parse);
        this.state = {
            data:[],
            filters:{
                "launch_success":url_parse.launch_success,
                "land_success":url_parse.land_success,
                "launch_year":url_parse.launch_year
            }
        }
        //console.log(this.state.filters);
        // this.handleFilterChange=this.handleFilterChange.bind(this);
        // this.handleApplyFilters=this.handleApplyFilters.bind(this);
        // console.log(window.location.pathname);

        
    }

    fetchApi = API_URL =>{
        console.log(API_URL)
        fetch(API_URL)
        .then(response => response.json())
        .then(data => {this.setState({data:data})})
        .catch(error => console.log(error));
    }
    changeUrlPath = filters =>{
        //  const url_parse=querystring.parse(URL, null, null,
        //     null)
        //      console.log(url_parse);
        //      let URL_PATH="";
        //      if(url_parse.launch_success!=="") {

        //      }
        //      URL_PATH+="&launch_success="+url_parse.launch_success;
        //      if(url_parse.land_success!=="") URL_PATH+="&land_success="+url_parse.land_success;
        //      if(url_parse.launch_year!=="") URL_PATH+="&launch_year="+url_parse.launch_year;
        //      if(URL_PATH!=="") URL_PATH="/"+URL_PATH;
            var activeFilters={};
            if(filters.launch_success!==undefined) activeFilters["launch_success"]=filters.launch_success;
            if(filters.land_success!==undefined) activeFilters["land_success"]=filters.land_success;
            if(filters.launch_year!==undefined) activeFilters["launch_year"]=filters.launch_year;
            var path_url=querystring.stringify({...activeFilters});
            if (path_url!=="") path_url="/?"+path_url;
            console.log(path_url);
            const obj={
            title:"SpaceX",
            url:path_url
            }
            window.history.replaceState(obj,obj.title,obj.url);
    }
    updatedApiUrl = filters =>{
        var UPDATED_API_URL=API_BASE_URL
        if(filters.launch_success!==undefined || filters.land_success!==undefined || filters.launch_year!==undefined){
          UPDATED_API_URL+='&'+querystring.stringify({...filters});
        }
        return UPDATED_API_URL;
    }
    addFiltersToApiUrl = filters =>{
        var UPDATED_API_URL=this.updatedApiUrl(filters);
        this.changeUrlPath(filters);
        this.fetchApi(UPDATED_API_URL);
    }
    // handleFilterChange = (value,name) =>{
    //     // console.log(value);
    //     // console.log(name);
    //     if(this.state.filters[name]!==value){
    //         this.setState(prevState => {
    //           let filters = { ...prevState.filters};  
    //             filters[name] = value; 
    //             // console.log(filters);     
    //             return {filters}               
    //           })
    //     }
    // }
    handleApplyFilters = (value,name) =>{
        const filters = { ...this.state.filters, [name]: value }
        this.setState(() => ({ filters }))
        // console.log(filters);
        this.addFiltersToApiUrl(filters);
    }
    componentDidMount(){
        console.log("hi im in component did mount");
        var path_state = window.history.state;
        if(path_state===null){
            this.fetchApi(API_BASE_URL);
        }else{
            var path=path_state.url;
            console.log(path);
            const url_parse=querystring.parse(path, null, null,
                null);
            console.log(url_parse);
            var UPDATED_API_URL =this.updatedApiUrl(url_parse);
            this.fetchApi(UPDATED_API_URL);
            
        }
   
    }
    // shouldComponentUpdate(nextProps, nextState){
    //     return this.state.filters!==nextState.filters
    //    }
    SpacexMissions = ()=>(
        this.state.data.map(mission=>{
            const {flight_number,mission_name,mission_id,links,rocket,launch_year,launch_success}=mission;
            // console.log(rocket.first_stage.cores[0].land_success);
            // console.log(launch_success);
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
                               <span className="spacex-mission-value">
                                    {launch_success ? "True" : "False"}
                               </span>
                           </div>
                           <div className="spacex-mission-label">
                               Land Succesfull :
                               <span className="spacex-mission-value">
                                    {rocket.first_stage.cores[0].land_success? "True":"False"}
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
                        <Select 
                            className="spacex-dropdown" 
                            placeholder="Launch Success" 
                            options={filterLaunchLand} 
                            onChange= {
                                (e)=>this.handleApplyFilters(e.value,"launch_success")
                            }
                        />
                    </div>
                    <div className="spacex-buttons-label">
                        <Select 
                            className="spacex-dropdown" 
                            placeholder="Land Success" 
                            options={filterLaunchLand}
                            onChange= {
                               (e)=> this.handleApplyFilters(e.value,"land_success")
                            } 
                        />
                    </div>
                    <div className="spacex-buttons-label">
                        <Select 
                            className="spacex-dropdown" 
                            placeholder="Launch Year"
                           
                            options={filterYears}  
                            onChange= {
                               (e)=> this.handleApplyFilters(e.value,"launch_year")
                            }
                        />
                    </div>
                    {/* <div className="spacex-buttons-label">
                        <button 
                            className="spacex-applyfilter-button"
                            onClick={this.handleApplyFilters}
                        >
                            Apply Filters
                        </button>
                    </div> */}
                </div>
                <div className="spacex-missions">
                    <this.SpacexMissions/>
                </div>
            </div>
        )
    }
}
