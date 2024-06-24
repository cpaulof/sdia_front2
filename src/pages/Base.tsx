import React from 'react';

import { Separator } from "@radix-ui/react-dropdown-menu";
import NavBar from "~/components/navbar";
import { Skeleton } from "~/components/ui/skeleton";
import AboutMe from './AboutMe';
import { Outlet } from 'react-router-dom';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function Base(){
    return (
      <div className="dark min-h-screen min-w-screen bg-gray-950" >
      {/* <link href='https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css' rel='stylesheet' /> */}
      {/* <NavBar /> */}
      <div className='container w-11/12 mx-auto pt-20 text-white' >
    
      <Outlet />
      
      </div>
    </div>
    )
}