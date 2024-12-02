import getCurrentUser from '@/actions/getCurrentUser'
import { redirect } from 'next/navigation';
import React from 'react'

import prismadb from "@/lib/prismadb";
import NavigationAction from './NavigationAction';
import { SelectSeparator } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from './NavigationItem';
import { ModeToggle } from '@/components/mode-toggle';
import UserAvatar from './UserAvatar';

const NavigationSidebar = async() => {

    const profile = await getCurrentUser();

    if (!profile) {
        return redirect("/");
    }

    const servers = await prismadb.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });


  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-slate-950 bg-gray-100 py-3'>
      <NavigationAction />
      <SelectSeparator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto'/>
      <ScrollArea className='flex-1 w-full'>
        {
            servers.map((server, index) => (
                <div key={server.id} className='mb-4'>
                    <NavigationItem name={server.name} imageUrl={server.imageUrl} id={server.id} />
                </div>
            ))
        }
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ModeToggle />
        <UserAvatar imageUrl={profile.image} username={profile.username!}/>
      </div>
    </div>
  )
}

export default NavigationSidebar
