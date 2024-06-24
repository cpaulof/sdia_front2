import { Separator } from '@radix-ui/react-dropdown-menu';
import { ChevronRightCircle, CircleStop, Play, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import {View, Image, StyleSheet} from 'react-native';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';


const SERVER_URL = "http://127.0.0.1:5000/"

async function checkVideoFeed(){
  const feed_url = SERVER_URL+"video_feed"
  const response = await fetch(feed_url)
  return response.status === 200;
}


export default function AboutMe(){
    const [feedKey, setFeedKey] = useState(0)
    async function startCapture(){
      //setFeedKey(feedKey+1)
      const r = await fetch(SERVER_URL+"start_capture").catch(err=>{})
      
    }
    async function reloadCapture(){
      //fetch(SERVER_URL+"start_capture")
      setFeedKey(feedKey+1);
      console.log(feedKey)
    }
    async function stopCapture(){
      const r = await fetch(SERVER_URL+"stop_capture").catch(err=>{})
      //setFeedKey(feedKey+1);
    }
    function changeMode(mode:String){
      fetch(SERVER_URL+"change_detection_mode?mode="+mode).catch(err=>{})
    }
    function changeMode2(d:any){
        console.log(d)
    }
    return (
    <>
      {/* <div className='grid grid-cols-2'>
        <Skeleton className="h-[400px] w-[270px] rounded-xl" />
        <div>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
           Sobre mim
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Meu nome é Paulo Fernando, tenho 28 anos e curso Sistemas Informações. Amo Inteligência Artificial e 
          </p>

        </div>
      </div>  
        <Separator className='m`y-2'/>
        <Skeleton className="h-[400px] w-[270px] rounded-xl" />
        
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            "After all," he said, "everyone enjoys a good joke, so it's only fair
            that they should pay for the privilege."
        </blockquote>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Sobre mim
        </h2> */}
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-5">
      Live Feed
      </h2>
      <div className="mt-1">
        <Button variant="outline" size="sm" onClick={reloadCapture}>
        <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={startCapture}>
        <Play className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={stopCapture}>
        <CircleStop className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="w-[900px] mt-1 ">
        <AspectRatio ratio={16 / 9} className="bg-muted border-2 border-white rounded-md">
          <Image key={feedKey} alt={feedKey+"_key"} style={{width:"100%", height:"100%"}} source={{uri:"http://127.0.0.1:5000/video_feed?rr="+feedKey}} onError={()=>{setTimeout(()=>{setFeedKey(feedKey+1)}, 2000)}} />
        
        </AspectRatio>
      </div>
      
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-5">
      Modelos de Detecção.
      </h2>

      {/* <div className='m-5'>
      <Button variant="secondary"onClick={()=>{changeMode("face")}}>
        Model 1
      </Button>
      <Button variant="secondary" onClick={()=>{changeMode("pid")}}>
        Model 2
      </Button>
      <Button variant="secondary"onClick={()=>{changeMode("none")}}>
        Nenhum
      </Button>
      </div> */}

      <RadioGroup className="mt-2" defaultValue="none" onValueChange={changeMode}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="face" id="r1" />
          <Label htmlFor="r1">Detecção de Face</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pid" id="r2" />
          <Label htmlFor="r2">Detecção de Objetos (Aereo)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="none" id="r3" />
          <Label htmlFor="r3">Nenhum</Label>
        </div>
      </RadioGroup>

      
      </>
    )
}