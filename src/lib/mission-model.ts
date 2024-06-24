export enum WaypointMissionFinishedAction{
    NO_ACTION           = 0,
    GO_HOME             = 1,
    AUTO_LAND           = 2,
    GO_FIRST_WAYPOINT   = 3,
    CONTINUE_UNTIL_END  = 4,
}

export enum WaypointMissionGotoWaypointMode{
    SAFELY          = 0,
    POINT_TO_POINT  = 1
}
export enum WaypointMissionFlightPathMode{
    NORMAL = 0,
    CURVED = 1
}
export enum WaypointMissionHeadingMode{
    AUTO                            = 0,
    USING_INITIAL_DIRECTION         = 1,
    CONTROL_BY_REMOTE_CONTROLLER    = 2,
    USING_WAYPOINT_HEADING          = 3,
    TOWARD_POINT_OF_INTEREST        = 4
}
export enum WaypointTurnMode{
    CLOCKWISE           = 0,
    COUNTER_CLOCKWISE   = 1
}
export enum WaypointActionType{
    STAY                    = 0,
    START_TAKE_PHOTO        = 1,
    START_RECORD            = 2,
    STOP_RECORD             = 3,
    RESET_GIMBAL_YAW        = 4,
    GIMBAL_PITCH            = 5,
    CAMERA_ZOOM             = 6,
    CAMERA_FOCUS            = 7,
    PHOTO_GROUPING          = 8,
    FINE_TUNE_GIMBAL_PITCH  = 9
}

export class WaypointAction{
    public id:number;
    public action_type: WaypointActionType;
    public action_param: number;

    public constructor(t:WaypointActionType, p:number){
        this.id = -1;
        this.action_type = t;
        this.action_param = p;
    }
    public setId(id:number){
        this.id = id;
    }
}

export class Waypoint{
    public id:number;
    public latitude: number;
    public longitude: number;
    public altitude: number;
    public turn_mode: WaypointTurnMode;
    public waypoint_actions: Array<WaypointAction>;

    public constructor(lat:number, lng:number, alt:number, turn_mode:WaypointTurnMode){
        this.id = -1;
        this.latitude = lat;
        this.longitude = lng;
        this.altitude = alt;
        this.turn_mode = turn_mode;
        this.waypoint_actions = new Array<WaypointAction>();
    }

    public add_action(action:WaypointAction){
        action.setId(this.waypoint_actions.length+1);
        this.waypoint_actions.push(action);
    }

    public setId(id:number){
        this.id = id;
    }
}

export class MissionModel{
    public name:string;
    public point_of_interest:string;
    public auto_flight_speed:number;
    public max_flight_speed:number;
    public exit_on_signal_lost: boolean;
    public finished_action: WaypointMissionFinishedAction;
    public flight_path_mode: WaypointMissionFlightPathMode;
    public goto_first_waypoint_mode: WaypointMissionGotoWaypointMode;
    public heading_mode: WaypointMissionHeadingMode;
    public gimbal_pitch_rotation_enabled: boolean;
    public repeat_times: number;
    public waypoints: Array<Waypoint>;

    public constructor(name:string, poi:string, afs:number, mfs:number, eosl:boolean,
        end_action:WaypointMissionFinishedAction, fpm:WaypointMissionFlightPathMode,
        goto_mode: WaypointMissionGotoWaypointMode, heading_mode: WaypointMissionHeadingMode,
        gimbal_rotation:boolean, repeat_times:number
    ){
        this.name = name;
        this.point_of_interest = poi;
        this.auto_flight_speed = afs;
        this.max_flight_speed = mfs;
        this.exit_on_signal_lost = eosl;
        this.finished_action = end_action;
        this.flight_path_mode = fpm;
        this.goto_first_waypoint_mode = goto_mode;
        this.heading_mode = heading_mode;
        this.gimbal_pitch_rotation_enabled = gimbal_rotation;
        this.repeat_times = repeat_times;
        this.waypoints = new Array<Waypoint>();
    }

    public add_waypoint(wp:Waypoint){
        wp.setId(this.waypoints.length+1);
        this.waypoints.push(wp);
    }
}


export function get_keys(obj:any){
    const size = Object.keys(obj).length/2;
    const a = Array()
    for(var i=0;i<size; i++){
        a.push(obj[i]);
    }
    return a;
}



