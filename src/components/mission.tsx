import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import PropTypes, {InferProps} from 'prop-types';
import * as mission_model from '~/lib/mission-model';
import Waypoint from "~/components/waypoint"
import Marker from "./marker";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    
  } from "~/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "~/components/ui/accordion"
import { Button } from "./ui/button";
import { createRoot } from "react-dom/client";

const mapboxgl = require('mapbox-gl');


  

function addMarker(waypoint:mission_model.Waypoint,  map:any){
    const ele = document.createElement('div');
    ReactDOM.render(<Marker className={'marker'} index={waypoint.id}/>,ele);
    let marker = new mapboxgl.Marker({element:ele})
    .setLngLat([waypoint.longitude, waypoint.latitude])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h3>Waypoint ${waypoint.id}</h3><p>Location: ${waypoint.latitude}:${waypoint.longitude}</p><p>Altitude: ${waypoint.altitude}</p><p>Actions: ${waypoint.waypoint_actions.length}</p>`
        )
    ).addTo(map);
    
    console.log(marker.getElement());
    return marker;
  }

function addPOIMarker(poi:string, map:any){
    const lnglat = poi.split(':').reverse().map(e=>{return Number.parseFloat(e)});
    const ele = document.createElement('div');
    ReactDOM.render(<Marker className={'poi-marker'} index={"POI"}/>, ele);
    let marker = new mapboxgl.Marker({element:ele})
    .setLngLat(lnglat)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h3>Point of Interest</h3><div><p><spam>lat: ${lnglat[1]}</spam></p><p><spam>lng: ${lnglat[0]}</spam></p></div>`
          )
      );
    marker.addTo(map);
    console.log(marker.getElement());
    return marker;
  }

function createMissionArea(coords:any, map:any){
   
    console.log(coords);
    map.addSource('mission_area', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': coords
            }
        }
    });
    map.addLayer({
        'id': 'mission_area',
        'type': 'fill',
        'source': 'mission_area', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    });
    // map.addLayer({
    //     'id': 'outline',
    //     'type': 'line',
    //     'source': 'kkk',
    //     'layout': {},
    //     'paint': {
    //         'line-color': '#000',
    //         'line-width': 3
    //     }
    // });
}

// type propTypes = {
//     mission: mission_model.MissionModel, map:any
// }

export default function Mission({mission, map}:InferProps<typeof Mission.propTypes>){
    const [mapLoaded, setMapLoaded] = useState(false);
    const [markers, setMarkers] = useState<any>([])
    const [coords, setCoords] = useState<any>([])
    console.log(mapLoaded, markers.length);
    if(!mission) return (<div>No Mission</div>);
    if(!map) return (<div>No Mission</div>);

    if(map.isStyleLoaded()){
        if(!mapLoaded) setMapLoaded(true);
    }
    map.on('load', ()=>{
        if(!mapLoaded)setMapLoaded(true);
    });

    if(mapLoaded){
        try{
            map.removeLayer('mission_area');
            map.removeSource('mission_area');
            console.log('source e layer excluidos')}
        catch(e){ 
        }
        const coords_:any = [mission.waypoints.map((e:any)=>{return [e.longitude, e.latitude]})];
        console.log(coords_);
        console.log(coords_.length);
        createMissionArea(coords_, map);
        addPOIMarker(mission.point_of_interest, map);
        map.setCenter(mission.point_of_interest.split(':').reverse().map((e:string)=>{return parseFloat(e)}))
        if(mission.waypoints.length!=coords[0]?.length){
            console.log('--------------------')
            console.log(mission.waypoints.length)
            console.log(coords[0]?.length)
            console.log(coords_[0]?.length)
            const markers_:any = []
            mission.waypoints.forEach((e:mission_model.Waypoint)=>{const m = addMarker(e, map);markers_.push(m)});
            if(markers.length>0){
                markers.forEach((e:any) => {
                    e.remove();
                });
            }
            setCoords(coords_);
            setMarkers(markers_);
        }
        
        

        
    }
    
    
    
    
    return (
        <div>
            
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
               {mission.name}
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <p className="text-xl text-muted-foreground">
                        Parametros
                        </p>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-small">Ponto de Interesse</TableCell>
                                    <TableCell className="text-center font-small">{mission.point_of_interest.split(':').map((e:string)=>{return parseFloat(e).toFixed(5)}).join(":")} (lat/lng)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Velocidade de Voo Padrão</TableCell>
                                    <TableCell className="text-center font-small">{mission.auto_flight_speed} m/s</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Velocidade de Voo Máxima</TableCell>
                                    <TableCell className="text-center font-small">{mission.max_flight_speed} m/s</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Cancelar missão ao perder sinal</TableCell>
                                    <TableCell className="text-center font-small">{mission.exit_on_signal_lost?"SIM":"NÃO"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Ação ao finalizar</TableCell>
                                    <TableCell className="text-center font-small">{mission_model.WaypointMissionFinishedAction[mission.finished_action]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Modo de Voo</TableCell>
                                    <TableCell className="text-center font-small">{mission_model.WaypointMissionFlightPathMode[mission.flight_path_mode]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Ir ao primeiro Ponto</TableCell>
                                    <TableCell className="text-center font-small">{mission_model.WaypointMissionGotoWaypointMode[mission.goto_first_waypoint_mode]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-small">Heading Mode</TableCell>
                                    <TableCell className="text-center font-small">{mission_model.WaypointMissionHeadingMode[mission.heading_mode]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Rotação do Gimbal Ativida</TableCell>
                                    <TableCell className="text-center font-small">{mission.gimbal_pitch_rotation_enabled?"SIM":"NÃO"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Repetições</TableCell>
                                    <TableCell className="text-center font-small">{mission.repeat_times}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <p className="text-xl text-muted-foreground text-center pt-5">
                Waypoints: {mission.waypoints.length}
            </p>
            <Accordion type="single" collapsible className="w-full">
                {mission.waypoints.map((wp:mission_model.Waypoint, wp_index:number)=>{
                    return <AccordionItem value={"item_"+wp_index}>
                        <AccordionTrigger value="item-1">
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            Waipoint {wp_index+1}
                        </h4>
                        </AccordionTrigger>
                        <AccordionContent>
                        <Table>
                                    
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-small">Latitude</TableCell>
                                            <TableCell className="text-left font-small">{wp.latitude}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-small">Longitude</TableCell>
                                            <TableCell className="text-left font-small">{wp.longitude}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-small">Altitude</TableCell>
                                            <TableCell className="text-left font-small">{wp.altitude}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-small">Modo de Rotação</TableCell>
                                            <TableCell className="text-left font-small">{mission_model.WaypointTurnMode[wp.turn_mode]}</TableCell>
                                        </TableRow>
                                        <TableRow className="pl-2">
                                            <TableCell colSpan={2} className="">
                                                <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem value="item-1">
                                                            <AccordionTrigger>
                                                                <p className="pl-5 text-sm text-muted-foreground">Ações: {wp.waypoint_actions.length}</p>
                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                <Table className="w-1/2">
                                                                    <TableHeader>
                                                                        <TableHead>#</TableHead>
                                                                        <TableHead>Tipo</TableHead>
                                                                        <TableHead>Parametro</TableHead>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        
                                                                            {wp.waypoint_actions.map((a:mission_model.WaypointAction, i:number)=>{
                                                                                return (
                                                                                    <TableRow >
                                                                                    <TableCell className="font-small">{i+1}</TableCell>
                                                                                    <TableCell className="font-small">{mission_model.WaypointActionType[a.action_type]}</TableCell>
                                                                                    <TableCell className="font-small">{a.action_param}</TableCell>
                                                                                    </TableRow>
                                                                                );
                                                                            })}
                                                                        
                                                                        
                                                                    </TableBody>
                                                                </Table>

                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                        </AccordionContent>

                    </AccordionItem>
                })}
            </Accordion>

            {/* <p>quant waypoints: {mission.waypoints.length}</p>
            {mission.waypoints.map((e:mission_model.Waypoint, i:number)=>{
                return (<Waypoint key={e.id} wp={e} map={map}/>)
            })} */}
        </div>
    );

}

Mission.propTypes = {
    mission: mission_model.MissionModel, map:mapboxgl.Map, setMission:Function
  };


//   <Table>
//                             <TableBody>
//                                 <TableRow>
//                                     <TableCell className="font-small">Latitude</TableCell>
//                                     <TableCell className="text-center font-small">{mission.point_of_interest} (lat/lng)</TableCell>
//                                 </TableRow>
//                                 <TableRow>
//                                     <TableCell className="font-small">Longitude</TableCell>
//                                     <TableCell className="text-center font-small">{mission.auto_flight_speed} m/s</TableCell>
//                                 </TableRow>
//                                 <TableRow>
//                                     <TableCell className="font-small">Altitude</TableCell>
//                                     <TableCell className="text-center font-small">{mission.max_flight_speed} m/s</TableCell>
//                                 </TableRow>
//                                 <TableRow>
//                                     <TableCell className="font-small">Modo de Rotação</TableCell>
//                                     <TableCell className="text-center font-small">{mission.exit_on_signal_lost?"SIM":"NÃO"}</TableCell>
//                                 </TableRow>
//                                 <TableRow className="pl-2">
//                                     <TableCell colSpan={2} className="">
//                                         <Accordion type="single" collapsible className="w-full">
//                                                 <AccordionItem value="item-1">
//                                                     <AccordionTrigger>
//                                                         <p className="pl-5 text-sm text-muted-foreground">Ações: 2</p>
//                                                     </AccordionTrigger>
//                                                     <AccordionContent>
//                                                         <Table>
//                                                             <TableHeader>
//                                                                 <TableHead>#</TableHead>
//                                                                 <TableHead>Tipo</TableHead>
//                                                                 <TableHead>Parametro</TableHead>
//                                                             </TableHeader>
//                                                             <TableBody>
//                                                                 <TableRow >
//                                                                 <TableCell className="font-small">Longitude</TableCell>
//                                                                 </TableRow>
//                                                             </TableBody>
//                                                         </Table>

//                                                     </AccordionContent>
//                                                 </AccordionItem>
//                                             </Accordion>
//                                         </TableCell>
//                                 </TableRow>
//                             </TableBody>
//                         </Table>