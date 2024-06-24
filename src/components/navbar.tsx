import React, { useEffect, useState } from "react";

import { Menu } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"


function DropDown(){
    return (
        <DropdownMenu >
            <DropdownMenuTrigger ><Menu className="text-white h-10 w-10"/></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <h5 className=" scroll-m-20 text-lg font-semibold tracking-tight ">
                        Sobre mim
                    </h5>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <h5 className=" scroll-m-20 text-lg font-semibold tracking-tight ">
                        Experiencia
                    </h5>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <h5 className=" scroll-m-20 text-lg font-semibold tracking-tight ">
                        Projetos
                    </h5>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <h5 className=" scroll-m-20 text-lg font-semibold tracking-tight ">
                        Blog
                    </h5>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default function NavBar(){
    const [small, setSmall] = useState(window.innerWidth <= 975);
    useEffect(()=>{
        window.addEventListener("resize", resize);
    }, []) 
    function resize(){
        setSmall(window.innerWidth <= 975);
        console.log(window.innerWidth)
    }

    return (
    <div className='shadow-sm shadow-white  w-full p-4 fixed bg-gray-950 z-10'>
        <div className='w-6/12  grid lg:grid-cols-4 md:grid-cols-1 lg:m-auto md:m-0'>
            {small?<DropDown />:<>
        <a href="/aboutme" className="">
          <h4 className="text-white scroll-m-20 text-xl font-semibold tracking-tight px-10 text-center hover:border-b border-white">
            Sobre mim
          </h4>
          </a>
          <a href="/exp">
            <h4 className="text-white scroll-m-20 text-xl font-semibold tracking-tight px-10 text-center hover:border-b border-white">
              Experiencia
            </h4>
          </a>
          <a href="/projects">
            <h4 className="text-white scroll-m-20 text-xl font-semibold tracking-tight px-10 text-center hover:border-b border-white">
              Projetos
            </h4>
          </a>
          <a href="/blog">
            <h4 className="text-white scroll-m-20 text-xl font-semibold tracking-tight px-10 text-center hover:border-b border-white">
              Blog
            </h4>
          </a></>}
          
        </div>
    </div>
    );
}