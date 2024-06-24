import React, { useEffect, useState } from "react";
import PropTypes, {InferProps} from 'prop-types';
import * as mission_model from '~/lib/mission-model';

export default function WaypointAction({wp_action}:InferProps<typeof WaypointAction.propTypes>){
    if(!wp_action) return (<div>No Waypoint!</div>);
    return (
        <div>
            <h2>Action</h2>
            <p>{wp_action.action_type}</p>
            <p>{wp_action.action_param}</p>
        </div>
    );

}

WaypointAction.propTypes = {
    wp_action: mission_model.WaypointAction
  };