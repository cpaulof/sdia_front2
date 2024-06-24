import { Separator } from '@radix-ui/react-dropdown-menu';
import React from 'react';
import { Skeleton } from '~/components/ui/skeleton';

export default function Blog(){
    return (
    <>
      <div className='grid grid-cols-2'>
        <Skeleton className="h-[400px] w-[270px] rounded-xl" />
        <div>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Blog
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king thought long and hard, and finally came up with 
            a brilliant plan
            : he would tax the jokes in the kingdom. The king thought long and hard, and finally came up with 
            a brilliant plan
            : he would tax the jokes in the kingdom. The king thought long and hard, and finally came up with 
            a brilliant plan
            : he would tax the jokes in the kingdom. The king thought long and hard, and finally came up with 
            a brilliant plan
            : he would tax the jokes in the kingdom.
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
            Projects
        </h2>
        
      </>
    )
}