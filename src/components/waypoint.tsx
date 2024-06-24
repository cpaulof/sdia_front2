import React, { useEffect, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import * as ReactDOM from "react-dom";
import PropTypes, {InferProps} from 'prop-types';
import * as mission_model from '~/lib/mission-model';
import WaypointAction from "./waypoint-action";
import Marker from "./marker";
const mapboxgl = require('mapbox-gl');



export default function Waypoint({wp, map}:InferProps<typeof Waypoint.propTypes>){
    if(!wp) return (<div>No Waypoint!</div>);
    if(!map) return (<div>No Map</div>);
    //addMarker(wp, map);
    return (
        <div>
            <p>{wp.latitude}</p>
            <p>{wp.longitude}</p>
            <p>{wp.altitude}</p>
            {wp.waypoint_actions.map((e:mission_model.WaypointAction, i:number)=>{
                return (<WaypointAction key={e.id} wp_action={e} />)
            })}
        </div>
    );

}

Waypoint.propTypes = {
    wp: mission_model.Waypoint, map:mapboxgl.Map
  };