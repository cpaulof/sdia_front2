import { Separator } from '@radix-ui/react-dropdown-menu';
import { Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Mission from '~/components/mission';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { MissionModel, Waypoint, WaypointAction, WaypointActionType, WaypointMissionFinishedAction, WaypointMissionFlightPathMode, WaypointMissionGotoWaypointMode, WaypointMissionHeadingMode, WaypointTurnMode, get_keys } from '~/lib/mission-model';

const mapboxgl = require('mapbox-gl');

export default function Projects(){
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isMissionInit, setIsMissionInit] = useState(false)
  const [mapObj, setMapObj] = useState<any>();
  const [lng, setLng] = useState(-44.247196);
  const [lat, setLat] = useState(-2.614339);
  const [zoom, setZoom] = useState(17);
  const [current_mission, setMission] = useState<MissionModel>()
  
  // this.name = name;
  // this.finished_action = end_action;
  // this.flight_path_mode = fpm;
  // this.goto_first_waypoint_mode = goto_mode;
  // this.heading_mode = heading_mode;
  // this.gimbal_pitch_rotation_enabled = gimbal_rotation;
  // this.repeat_times = repeat_times;
  const [missionForm, setMissionForm] = useState({
    name: "",
    point_of_interest: "",
    auto_flight_speed: 0,
    max_flight_speed: 0,
    exit_on_signal_lost: false,
    finished_action: "",
    flight_path_mode: "",
    goto_first_waypoint_mode: "",
    heading_mode: "",
    gimbal_pitch_rotation_enabled: false,
    repeat_times: 1,
    waypoints: []
  });

  const [waypointForm, setWaypointForm] = useState({latitude:0, longitude:0, altitude:0, turn_mode:"", actions: []})
  const [actionsForm, setActionsForm] = useState<any[]>([])
  const [action, setAction] = useState({action_param:0, action_type:""})

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
    setMapObj(map.current)
  });
  if(mapObj){
    mapObj.on('click', (e:any) => {
      console.log(`click event ${e.lngLat} and ${e.lngLat.lat}mission is ${isMissionInit?'':'not '}created!`)
      if(!isMissionInit){
        setMissionForm({...missionForm, point_of_interest:`${e.lngLat.lat}:${e.lngLat.lng}`})
      }else{
        setWaypointForm({...waypointForm, latitude:e.lngLat.lat, longitude:e.lngLat.lng})
      }
    });
    mapObj.on('mouseover', () => {
      mapObj.getCanvas().style.cursor = 'crosshair'
    });
    mapObj.on('mouseleave', () => {
      mapObj.getCanvas().style.cursor = ''
    })
  }

  function gotoLatlng(){
    console.log(missionForm)
    mapObj.setCenter(missionForm.point_of_interest.split(':').reverse().map((e:string)=>{return Number.parseFloat(e)}));
  }

  function add_action(){
    setActionsForm([...actionsForm, action])
  }

  function add_waypoint_(){
    console.log(current_mission)
    if(!current_mission) return;
    const wp:Waypoint = new Waypoint(
      waypointForm.latitude,
      waypointForm.longitude,
      waypointForm.altitude,
      WaypointTurnMode[waypointForm.turn_mode as keyof typeof WaypointTurnMode],
    );
    actionsForm.forEach((e)=>{wp.add_action(new WaypointAction(
      WaypointActionType[e.action_type as keyof typeof WaypointActionType],
      e.action_param
    ))});
    //const new_mission:MissionModel = structuredClone(current_mission);
    wp.setId(current_mission.waypoints.length+1);
    current_mission.waypoints.push(wp);
    //current_mission.add_waypoint(wp);
    setMission(current_mission);
    setActionsForm([])
    setAction({action_param:0, action_type:""})

  }

  function create_mission(){
    try{
      const mission: MissionModel = new MissionModel(
        missionForm.name, 
        missionForm.point_of_interest,
        missionForm.auto_flight_speed,
        missionForm.max_flight_speed,
        missionForm.exit_on_signal_lost,
        WaypointMissionFinishedAction[missionForm.finished_action as keyof typeof WaypointMissionFinishedAction],
        WaypointMissionFlightPathMode[missionForm.flight_path_mode as keyof typeof WaypointMissionFlightPathMode],
        WaypointMissionGotoWaypointMode[missionForm.goto_first_waypoint_mode as keyof typeof WaypointMissionGotoWaypointMode],
        WaypointMissionHeadingMode[missionForm.heading_mode as keyof typeof WaypointMissionHeadingMode],
        missionForm.gimbal_pitch_rotation_enabled,
        missionForm.repeat_times
      );
      setMission(mission);
      setIsMissionInit(true);
    }
    catch(e){
      console.log(e)
    }
  }
  
  
    return (
    <>
      <div className='flex flex-row space-x-10'>
          <div ref={mapContainer} className="map-container basis-1/3 border rounded-md p-1" />
          
          <Tabs defaultValue="parametros" className="basis-1/3">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center mb-5">
                  Criar Missão
                </h4>
              <TabsList className="flex w-full">
                <TabsTrigger className="basis-1/2" value="parametros">Paramêtros</TabsTrigger>
                <TabsTrigger disabled={!isMissionInit} className="basis-1/2" value="waypoints">Waypoints</TabsTrigger>
              </TabsList>
              <TabsContent value="parametros">
              <div className='basis-1/3 border p-4 rounded'>
                    
                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label htmlFor="name">Nome</Label>
                      <Input type="text" id="name" placeholder="Nome da Missão" value={missionForm?.name} onChange={(e)=>{ setMissionForm({...missionForm, name:e.target.value})}}/>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label htmlFor="poi">Ponto de Interesse</Label>
                      <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input id="poi" type="text" value={missionForm?.point_of_interest} placeholder="Ponto de Interesse" onChange={(e)=>{ setMissionForm({...missionForm, point_of_interest:e.target.value})}}/>
                      <Button onClick={()=>{gotoLatlng()}}>Ver</Button>
                    </div>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4 mb-3">
                      <Label htmlFor="vel">Velocidade de Voo (m/s)</Label>
                      <div className="flex space-x-1">
                        <Input type="number" id="vel" placeholder="Velocidade Padrão" value={missionForm?.auto_flight_speed} 
                        onChange={(e)=>{ setMissionForm({...missionForm, auto_flight_speed:Number.parseFloat(e.target.value)})}}/>
                        <Input type="number" id="vel" placeholder="Velocidade Máxima" value={missionForm?.max_flight_speed} 
                        onChange={(e)=>{ setMissionForm({...missionForm, max_flight_speed:Number.parseFloat(e.target.value)})}}/>
                      </div>
                    </div>

                    <div className="flex w-full space-x-4 mb-3">
                      <div className="basis-1/2 items-center space-x-1">
                        <Checkbox id="eosl" checked={missionForm?.exit_on_signal_lost} 
                        onCheckedChange={(e)=>{setMissionForm({...missionForm, exit_on_signal_lost:e==true})}}/>
                        <label
                          htmlFor="eosl"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cancelar missão em perda de sinal?
                        </label>
                      </div>
                      
                    
                      <div className="basis-1/2 items-center space-x-1">
                        <Checkbox id="gimbal-pitch" checked={missionForm?.gimbal_pitch_rotation_enabled} 
                        onCheckedChange={(e)=>{setMissionForm({...missionForm, gimbal_pitch_rotation_enabled:e==true})}}/>
                        <label
                          htmlFor="gimbal-pitch"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Ativar rotação do Gimbal?
                        </label>
                      </div>
                    </div>

                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 mb-3">
                      <Label htmlFor="rep">Repetições</Label>
                      <Input type="number" id="rep" placeholder="Repetições" value={missionForm?.repeat_times} 
                        onChange={(e)=>{ setMissionForm({...missionForm, repeat_times:Number.parseInt(e.target.value)})}}/>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label>Ação de Finalização</Label>
                        <Select onValueChange={(e)=>{setMissionForm({...missionForm, finished_action:e})}} value={missionForm.finished_action}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Ação de Finalização" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup >
                            {get_keys(WaypointMissionFinishedAction).map((e:string)=>{return <SelectItem value={e}>{e}</SelectItem>})}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label>Modo de Voo</Label>
                        <Select onValueChange={(e)=>{setMissionForm({...missionForm, flight_path_mode:e})}} value={missionForm.flight_path_mode}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Modo de Voo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {get_keys(WaypointMissionFlightPathMode).map((e:string)=>{return <SelectItem value={e}>{e}</SelectItem>})}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label>Modo de Inicio da Missão</Label>
                        <Select onValueChange={(e)=>{setMissionForm({...missionForm, goto_first_waypoint_mode:e})}} value={missionForm.goto_first_waypoint_mode}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Modo de Inicio da Missão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {get_keys(WaypointMissionGotoWaypointMode).map((e:string)=>{return <SelectItem value={e}>{e}</SelectItem>})}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>


                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label>Modo de Orientação do Drone</Label>
                        <Select onValueChange={(e)=>{setMissionForm({...missionForm, heading_mode:e})}} value={missionForm.heading_mode}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Modo de Orientação do Drone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {get_keys(WaypointMissionHeadingMode).map((e:string)=>{return <SelectItem value={e}>{e}</SelectItem>})}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                  <div className='flex w-full mb-3'>
                    <Button onClick={create_mission} className='right-0'>Criar Missão</Button>
                  </div>
                    
                </div>
              </TabsContent>
              <TabsContent value="waypoints">
              <div className='basis-1/3 border p-4 rounded'>
              <h4 className=" text-xl font-semibold tracking-tight text-center">
                  Adicionar Waypoint
              </h4>
              <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-5" />
              <div className="flex w-full space-x-4 mb-3">
                  
                      <div className="basis-1/3 items-center space-x-1">
                        <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input disabled={true} type="number" id="latitude" placeholder="latitude" value={waypointForm.latitude} />
                        </div>
                      </div>
                      
                      <div className="basis-1/3 items-center space-x-1">
                        <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input disabled={true} type="number" id="longitude" placeholder="longitude" value={waypointForm.longitude} />
                        </div>
                      </div>

                      <div className="basis-1/3 items-center space-x-1">
                        <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                          <Label htmlFor="altitude">Altitude</Label>
                          <Input type="number" id="altitude" placeholder="altitude" />
                        </div>
                      </div>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                      <Label>Modo de virada</Label>
                        <Select onValueChange={(e)=>{setWaypointForm({...waypointForm, turn_mode:e})}} value={waypointForm.turn_mode}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Modo de virada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup >
                            {get_keys(WaypointTurnMode).map((e:string)=>{return <SelectItem value={e}>{e}</SelectItem>})}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
                      Ações
                    </h4>
                  <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-5" />
                  

                  <div className="flex w-full space-x-4 mb-3">
                  
                      <div className="basis-1/2 items-center space-x-1">
                        <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                        <Label>Tipo de Ação</Label>
                          <Select onValueChange={(e)=>{setAction({...action, action_type:e})}} value={action.action_type}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup >
                              {get_keys(WaypointActionType).map((e:string)=>{return <SelectItem value={e}>{e}</SelectItem>})}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      </div>
                      
                      <div className="basis-1/4 items-center space-x-1">
                        <div className="grid max-w-sm items-center gap-1.5 mb-3">
                          <Label htmlFor="action_param">Parametro</Label>
                          <Input type="number" id="action_param" placeholder="Parametro" value={action.action_param} 
                          onChange={(e)=>{ setAction({...action, action_param:Number.parseInt(e.target.value)})}}/>
                        </div>
                      </div>

                      <div className="basis-1/5 items-center space-x-1">
                        <div className="grid max-w-sm items-center gap-1.5 mb-3 pt-5">
                          
                          <Button variant="secondary" size="icon" onClick={add_action}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-5" />
                  <ScrollArea className="h-[200px] rounded-md border p-4 mb-5">
                    <Table>
                        <TableHeader>
                            <TableHead>#</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Parametro</TableHead>
                        </TableHeader>
                        <TableBody>
                          
                              {actionsForm.map((a:any, i:number)=>{
                                        return (
                                            <TableRow >
                                            <TableCell className="font-small">{i+1}</TableCell>
                                            <TableCell className="font-small">{a.action_type}</TableCell>
                                            <TableCell className="font-small">{a.action_param}</TableCell>
                                            </TableRow>
                                        );
                              })}
                          
                        </TableBody>
                    </Table>
                    </ScrollArea>

                  <div className='flex w-full mb-3 mt-3'>
                    <Button className='right-0' onClick={add_waypoint_}>Adicionar Waypoint</Button>
                  </div>
                    
                </div>
              </TabsContent>
            </Tabs>
          <div className='basis-1/3'>
            <Mission mission={current_mission} map={mapObj} setMission={setMission} />
          </div>
          <Dialog defaultOpen={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criando missões</DialogTitle>
                <DialogDescription>
                  Para criar uma missão, informe um ponto de interesse clicando no mapa ou preechendo o campo Ponto de Interesse no formato 
                  "lat:lng", por exemplo: <small className="italic bold">-2.444:-44.5545</small> e depois
                  continue com as outras informações.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div> 
        
    </>
    )
}
