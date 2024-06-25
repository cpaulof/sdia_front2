import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';

// import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '~/components/ui/button';
import * as mission from '~/lib/mission-model';
import Mission from '~/components/mission';
import Waypoint from '~/components/waypoint';
import { useParams } from 'react-router-dom';

const mapboxgl = require('mapbox-gl');

const mapC = <div id="map"></div>

type jsonBodyAction = {
  action_param: number,
  action_type: string
}
type jsonBodyWp = {
  latitude:number,
  longitude:number,
  altitude:number,
  turn_mode:string,
  actions: jsonBodyAction[]
}
type jsonBody = {
  name: string,
  poi:string,
  auto_flight_speed:number,
  max_flight_speed: number,
  finished_action: string,
  exit_on_signal_lost: boolean,
  flight_path_mode: string,
  goto_first_waypoint_mode:string,
  heading_mode:string,
  gimbal_pitch_rotation_enabled:boolean,
  repeat_times: number,
  waypoints: jsonBodyWp[]
}

mapboxgl.accessToken = 'pk.eyJ1IjoiY29wZm5mIiwiYSI6ImNseG5mcDJvbTAzODQyam9qZGF3MW10MHkifQ.gb3VwI0xiNfQ3haBfEIPmg';

async function create_mission(id:number){
  let m1:mission.MissionModel;
  const response = await fetch(`http://127.0.0.1:5000/mission?id=${id}`, {
    method: 'GET'
  });
  if(response.status!=200){return null}
  const m:jsonBody = await response.json();
  m1 = new mission.MissionModel(
    m.name,
    m.poi,
    m.auto_flight_speed,
    m.max_flight_speed,
    m.exit_on_signal_lost,
    mission.WaypointMissionFinishedAction[m.finished_action as keyof typeof mission.WaypointMissionFinishedAction],
    mission.WaypointMissionFlightPathMode[m.flight_path_mode as keyof typeof mission.WaypointMissionFlightPathMode],
    mission.WaypointMissionGotoWaypointMode[m.goto_first_waypoint_mode as keyof typeof mission.WaypointMissionGotoWaypointMode],
    mission.WaypointMissionHeadingMode[m.heading_mode as keyof typeof mission.WaypointMissionHeadingMode],
    m.gimbal_pitch_rotation_enabled,
    m.repeat_times
  );
  m.waypoints.forEach(w=>{
    const wp = new mission.Waypoint(w.latitude, w.longitude, w.altitude, mission.WaypointTurnMode[w.turn_mode as keyof typeof mission.WaypointTurnMode]);
    w.actions.forEach(a=>{
      const action = new mission.WaypointAction(mission.WaypointActionType[a.action_type as keyof typeof mission.WaypointActionType], a.action_param);
      wp.add_action(action);
    });
    m1.add_waypoint(wp);
  });
  return m1;
  // let m1:mission.MissionModel = new mission.MissionModel("Mission", "-2.61425:-44.24725", 5.0, 5.0, true, mission.WaypointMissionFinishedAction.GO_HOME,
  //   mission.WaypointMissionFlightPathMode.NORMAL, mission.WaypointMissionGotoWaypointMode.SAFELY, mission.WaypointMissionHeadingMode.AUTO, true, 1);
  
  // const wp1 = new mission.Waypoint(-2.6141, -44.2471, 10.0, mission.WaypointTurnMode.CLOCKWISE);
  // wp1.add_action(new mission.WaypointAction(mission.WaypointActionType.STAY, 10));
  // m1.add_waypoint(wp1);

  // const wp2 = new mission.Waypoint(-2.6143, -44.2471, 10.0, mission.WaypointTurnMode.CLOCKWISE);
  // wp2.add_action(new mission.WaypointAction(mission.WaypointActionType.STAY, 2));
  // wp2.add_action(new mission.WaypointAction(mission.WaypointActionType.START_TAKE_PHOTO, 0));
  // m1.add_waypoint(wp2);

  // const wp3 = new mission.Waypoint(-2.6145, -44.24725, 10.0, mission.WaypointTurnMode.CLOCKWISE);
  // wp3.add_action(new mission.WaypointAction(mission.WaypointActionType.STAY, 2));
  // wp3.add_action(new mission.WaypointAction(mission.WaypointActionType.START_TAKE_PHOTO, 10));
  // m1.add_waypoint(wp3);

  // const wp4 = new mission.Waypoint(-2.6143, -44.2474, 10.0, mission.WaypointTurnMode.CLOCKWISE);
  // wp4.add_action(new mission.WaypointAction(mission.WaypointActionType.STAY, 2));
  // wp4.add_action(new mission.WaypointAction(mission.WaypointActionType.START_TAKE_PHOTO, 10));
  // m1.add_waypoint(wp4);

  // const wp5 = new mission.Waypoint(-2.6141, -44.2474, 10.0, mission.WaypointTurnMode.CLOCKWISE);
  // wp5.add_action(new mission.WaypointAction(mission.WaypointActionType.STAY, 2));
  // wp5.add_action(new mission.WaypointAction(mission.WaypointActionType.START_TAKE_PHOTO, 10));
  // m1.add_waypoint(wp5);

  // const wp6 = new mission.Waypoint(-2.6139, -44.24725, 10.0, mission.WaypointTurnMode.CLOCKWISE);
  // wp6.add_action(new mission.WaypointAction(mission.WaypointActionType.CAMERA_ZOOM, 2));
  // wp6.add_action(new mission.WaypointAction(mission.WaypointActionType.START_TAKE_PHOTO, 5));
  // m1.add_waypoint(wp6);

  // return m1;
  //const size = Object.keys(mission.WaypointMissionHeadingMode).length/2;
  //console.log(mission.get_keys(mission.WaypointActionType));

}

function addMarker(waypoint:mission.Waypoint,  map:any){
  let marker = new mapboxgl.Marker(<div className='marker'></div>)
  .marker.setLngLat([waypoint.longitude, waypoint.latitude])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>Waypoint N</h3><p>Location: ${waypoint.latitude}:${waypoint.longitude}</p><p>Altitude: ${waypoint.altitude}</p><p>Actions: ${waypoint.waypoint_actions.length}</p>`
      )
  );
  marker.addTo(map);
  return marker;
}
type props = {
  mission_id: number
}

export default function Experience(){
  const mapContainer = useRef(null);
  const { mission_id } = useParams();
  const map = useRef(null);
  const [mapObj, setMapObj] = useState<any>();
  const [lng, setLng] = useState(-44.27920);
  const [lat, setLat] = useState(-2.536693);
  const [zoom, setZoom] = useState(17);
  const [current_mission, setMission] = useState<mission.MissionModel>()

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      interactive: true,
    });
    setMapObj(map.current);
    const id = mission_id!=undefined?parseInt(mission_id):14
    create_mission(id).then(r=>{if(r)setMission(r)});
  });
  function remove_waypoint(){
    const new_mission = structuredClone(current_mission);
    new_mission?.waypoints.pop();
    setMission(new_mission);
    console.log(new_mission?.waypoints)
}

  useEffect(()=>{
    if(mapObj) mapObj.setCenter([lng, lat])
  }, [lng, lat]);

    return (<>
        <div className="self-center mb-5"><h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl self-center text-center">
          Detalhes da Missão
        </h1>
        <Button onClick={()=>{remove_waypoint()}}>II</Button>
        </div>
        <div className='flex flex-row space-x-10'>
          <div ref={mapContainer} className="map-container basis-1/2 " /> 
          <div className='basis-1/2'>
            <Mission mission={current_mission} map={mapObj} setMission={setMission} />
          </div>
          {/* <Button onClick={()=>{setLat(lat+0.0001);if(current_mission !== undefined){current_mission.name="asd"}setMission(current_mission)}}>cima</Button>
          <Button onClick={()=>{setLat(lat-0.0001)}}>baixo</Button>
          <Button onClick={()=>{setLng(lng-0.0001)}}>esquerda</Button>
          <Button onClick={()=>{setLng(lng+0.0001);}}>direita</Button> */}
          {/* <Mission mission={current_mission} map={mapObj} /> */}
        </div> 
    
    </>)
}